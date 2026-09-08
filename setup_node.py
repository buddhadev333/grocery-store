import urllib.request
import zipfile
import os
import shutil

tools_dir = os.path.abspath(".tools")
os.makedirs(tools_dir, exist_ok=True)
zip_path = os.path.join(tools_dir, "node.zip")
node_dir = os.path.join(tools_dir, "node")

if not os.path.exists(os.path.join(node_dir, "node.exe")):
    url = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
    print(f"Downloading portable Node.js from {url}...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response, open(zip_path, 'wb') as out_file:
        shutil.copyfileobj(response, out_file)
    print("Extracting Node.js...")
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(tools_dir)
    extracted_name = os.path.join(tools_dir, "node-v20.18.0-win-x64")
    if os.path.exists(extracted_name):
        if os.path.exists(node_dir):
            shutil.rmtree(node_dir)
        os.rename(extracted_name, node_dir)
    if os.path.exists(zip_path):
        os.remove(zip_path)
    print("Portable Node.js setup complete!")
else:
    print("Portable Node.js already exists.")

node_exe = os.path.join(node_dir, "node.exe")
npm_cmd = os.path.join(node_dir, "npm.cmd")
print("Testing node:", node_exe)
os.system(f'"{node_exe}" -v')
os.system(f'"{npm_cmd}" -v')
