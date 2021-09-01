#!/bin/bash
echo Warning: running this file will replace the current database with the one on github. Are you sure you wish to continue?
select yn in "Yes" "No"; do
    case $yn in 
        Yes ) git pull && rm -r /var/lib/mysql/SmallProject && cp -R ./database/SmallProject /var/lib/mysql/SmallProject; break;;
        No ) exit;;
    esac
done
