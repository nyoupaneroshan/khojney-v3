/**
 * Auto-set creation for exams.
 *
 * When an exam has more than `QUESTIONS_PER_SET` questions, the system
 * automatically converts it into a parent exam with multiple child "sets".
 * Each set contains at most `QUESTIONS_PER_SET` questions.
 *
 * Example:
 *   Admin adds 25 questions to "Driving License Mock Test".
 *   System creates:
 *     - "Driving License Mock Test — Set 1" (questions 1–10)
 *     - "Driving License Mock Test — Set 2" (questions 11–20)
 *     - "Driving License Mock Test — Set 3" (questions 21–25)
 *   The original exam is marked `isParent: true` and no longer has direct
 *   questions — it becomes a grouping page that links to the sets.
 *
 * Triggered from:
 *   - POST /api/admin/exams/[id]/questions (single question add)
 *   - POST /api/admin/bulk-upload-questions (bulk add)
 *
 * Idempotent: if the exam is already a parent, the function reconciles the
 * child sets (creates new ones for overflow, removes empty ones, rebalances
 * questions across sets).
 */
import { db } from "@/lib/db";

export const QUESTIONS_PER_SET = 10;

interface ReconcileResult {
  converted: boolean;
  parentExamId: string;
  childSetsCreated: number;
  questionsReorganized: number;
}

/**
 * Reconcile the set structure for an exam after its questions change.
 *
 * Cases:
 *   1. Exam has > QUESTIONS_PER_SET questions and is NOT yet a parent:
 *      → Convert: create child sets, move questions, mark parent.
 *   2. Exam is already a parent:
 *      → Rebalance: fetch ALL questions across child sets, re-chunk into
 *        sets of QUESTIONS_PER_SET, delete empty children, create new
 *        children as needed, reassign questions.
 *   3. Exam has ≤ QUESTIONS_PER_SET questions and is NOT a parent:
 *      → No-op.
 *   4. Exam has 0 questions and is a parent:
 *      → Un-convert: delete all child sets, mark parent = false.
 *
 * This function is safe to call after every question mutation.
 */
export async function reconcileExamSets(
  examId: string
): Promise<ReconcileResult> {
  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: {
      questions: { select: { id: true, order: true }, orderBy: { order: "asc" } },
      children: {
        select: {
          id: true,
          slug: true,
          title: true,
          _count: { select: { questions: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!exam) {
    return { converted: false, parentExamId: examId, childSetsCreated: 0, questionsReorganized: 0 };
  }

  // If this exam IS itself a child (has a parentId), do nothing — sets logic
  // only applies to top-level exams.
  if (exam.parentId) {
    return { converted: false, parentExamId: examId, childSetsCreated: 0, questionsReorganized: 0 };
  }

  // Gather all questions that should be distributed.
  // If the exam is not yet a parent, "all questions" = its direct questions.
  // If the exam IS a parent, "all questions" = questions across all child sets
  // PLUS any stragglers still directly attached to the parent.
  let allQuestionIds: string[] = [];
  if (exam.isParent) {
    const childQuestions = await db.examQuestion.findMany({
      where: { exam: { parentId: examId } },
      select: { id: true, order: true, examId: true },
      orderBy: [{ examId: "asc" }, { order: "asc" }],
    });
    const parentStragglers = exam.questions.map((q) => q.id);
    allQuestionIds = [...childQuestions.map((q) => q.id), ...parentStragglers];
  } else {
    allQuestionIds = exam.questions.map((q) => q.id);
  }

  const totalQuestions = allQuestionIds.length;

  // Case 4: parent with no questions → un-convert.
  if (totalQuestions === 0 && exam.isParent) {
    await db.exam.deleteMany({ where: { parentId: examId } });
    await db.exam.update({ where: { id: examId }, data: { isParent: false } });
    return { converted: false, parentExamId: examId, childSetsCreated: 0, questionsReorganized: 0 };
  }

  // Case 3: not enough questions to warrant sets, and not yet a parent.
  if (totalQuestions <= QUESTIONS_PER_SET && !exam.isParent) {
    return { converted: false, parentExamId: examId, childSetsCreated: 0, questionsReorganized: 0 };
  }

  // Cases 1 & 2: distribute questions across child sets.
  // Strategy:
  //   - Reuse existing children where possible (rename them "Set N").
  //   - Create new children for overflow.
  //   - Delete children that have no questions after rebalancing.
  //   - Move questions to children in chunks of QUESTIONS_PER_SET.

  const chunkCount = Math.ceil(totalQuestions / QUESTIONS_PER_SET);
  const existingChildren = exam.children.slice(0, chunkCount);

  // Create any additional child exams needed.
  const newChildrenNeeded = chunkCount - existingChildren.length;
  const newChildren: { id: string; slug: string }[] = [];
  for (let i = 0; i < newChildrenNeeded; i++) {
    const setNumber = existingChildren.length + i + 1;
    const slug = `${exam.slug}-set-${setNumber}`;
    // Ensure slug uniqueness (rare but possible if old data exists).
    const existing = await db.exam.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;
    const created = await db.exam.create({
      data: {
        slug: finalSlug,
        title: `${exam.title} — Set ${setNumber}`,
        description: `Set ${setNumber} of ${exam.title}. Auto-generated from the parent exam.`,
        examType: exam.examType,
        durationMin: exam.durationMin,
        totalMarks: QUESTIONS_PER_SET,
        passingMarks: exam.passingMarks,
        difficulty: exam.difficulty,
        isPublished: exam.isPublished,
        isFeatured: false,
        parentId: examId,
        isParent: false,
        shuffleQuestions: exam.shuffleQuestions,
        shuffleOptions: exam.shuffleOptions,
        categoryId: exam.categoryId,
      },
      select: { id: true, slug: true },
    });
    newChildren.push(created);
  }

  // All child exams we'll use (existing + new), sorted by set number.
  const allChildren = [...existingChildren, ...newChildren].map((c, i) => ({
    ...c,
    setNumber: i + 1,
  }));

  // Chunk question IDs into groups of QUESTIONS_PER_SET.
  const chunks: string[][] = [];
  for (let i = 0; i < allQuestionIds.length; i += QUESTIONS_PER_SET) {
    chunks.push(allQuestionIds.slice(i, i + QUESTIONS_PER_SET));
  }

  // Reassign each chunk to its corresponding child exam.
  let reorganized = 0;
  for (let i = 0; i < allChildren.length; i++) {
    const child = allChildren[i];
    const chunk = chunks[i] ?? [];
    if (chunk.length === 0) {
      // No questions for this child — delete it.
      if (!existingChildren.find((c) => c.id === child.id)) {
        // It was newly created but is now empty — delete it.
        await db.exam.delete({ where: { id: child.id } }).catch(() => {});
      } else {
        // It was an existing child — also delete (rebalancing emptied it).
        await db.exam.delete({ where: { id: child.id } }).catch(() => {});
      }
      continue;
    }

    // Update the child's title and totalMarks to reflect its chunk.
    await db.exam.update({
      where: { id: child.id },
      data: {
        title: `${exam.title} — Set ${child.setNumber}`,
        totalMarks: chunk.length,
      },
    });

    // Reassign all questions in this chunk to this child.
    await db.examQuestion.updateMany({
      where: { id: { in: chunk } },
      data: { examId: child.id },
    });
    reorganized += chunk.length;
  }

  // Delete any leftover children that weren't used (e.g. if total question
  // count dropped).
  const usedChildIds = new Set(allChildren.map((c) => c.id));
  const unusedChildren = exam.children.filter((c) => !usedChildIds.has(c.id));
  if (unusedChildren.length > 0) {
    await db.exam.deleteMany({
      where: { id: { in: unusedChildren.map((c) => c.id) } },
    });
  }

  // Mark the parent exam.
  await db.exam.update({
    where: { id: examId },
    data: {
      isParent: true,
      // Parent's totalMarks = sum of children's marks.
      totalMarks: reorganized,
    },
  });

  // If the parent had any directly-attached questions (stragglers), they've
  // now been moved to children — verify by checking parent.question count.
  // (We don't delete them — they were moved via updateMany above.)

  return {
    converted: !exam.isParent, // true if this call converted a non-parent into a parent
    parentExamId: examId,
    childSetsCreated: newChildrenNeeded,
    questionsReorganized: reorganized,
  };
}
