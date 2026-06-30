#!/bin/bash
# Persistent dev server launcher. Runs the dev server in the background
# detached from any terminal session so it survives shell exits.
cd /home/z/my-project
exec bun run dev > /home/z/my-project/dev.log 2>&1
