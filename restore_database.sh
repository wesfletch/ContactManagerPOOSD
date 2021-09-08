#!/bin/bash
echo Warning: running this file will corrupt the production database. This file should only be used to restore a backup due to a major issue. Are you sure you wish to continue?
select yn in "Yes" "No"; do
    case $yn in 
        Yes ) git pull && rm -r /var/lib/mysql/SmallProject && cp -R ./database/SmallProject /var/lib/mysql/SmallProject && chown -hR mysql:mysql /var/lib/mysql/SmallProject; break;;
        No ) exit;;
    esac
done
