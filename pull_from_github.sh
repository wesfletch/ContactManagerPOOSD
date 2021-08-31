#!/bin/bash
echo Warning: running this file will replace the current database with the one on github. Are you sure you wish to continue?
select yn in "y" "n"; do
    case $yn in 
        y ) git pull && cp -R ./database/SmallProject /var/lib/mysql/SmallProject; break;;
        n ) exit;;
    esac
done