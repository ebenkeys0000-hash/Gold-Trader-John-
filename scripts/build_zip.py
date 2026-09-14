#!/usr/bin/env python3
import os
import sys
import zipfile

output_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/gold-trader-john-trading-world.zip'
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

exclude_dirs = {'.git', 'node_modules', 'dist', '.next', '__pycache__', '.vite', '.parcel-cache'}
exclude_files = {'.DS_Store', 'server.js'}

with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f not in exclude_files and not f.endswith('.zip'):
                file_path = os.path.join(root, f)
                arcname = os.path.relpath(file_path, base_dir)
                zipf.write(file_path, arcname)

print(f"Zip created at {output_path} ({os.path.getsize(output_path)} bytes)")
