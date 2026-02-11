#!/bin/sh

vault_dir="/mnt/data/projects/personal/ObsidianTest"
plugin_dir="${vault_dir}/.obsidian/plugins/cloud-sync/"

echo "Copying to ${plugin_dir}"
cp main.js 		    $plugin_dir
cp manifest.json 	$plugin_dir
cp styles.css 		$plugin_dir

