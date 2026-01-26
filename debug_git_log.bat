@echo off
git log -n 5 --stat > git_log_output.txt 2>&1
echo DONE >> git_log_output.txt
