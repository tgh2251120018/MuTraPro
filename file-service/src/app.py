from flask import Flask, jsonify, request
import os, json, time
app = Flask(__name__)
DB = 'data/files.json'
if not os.path.exists('data'): os.makedirs('data')
if not os.path.exists(DB):
    with open(DB,'w') as f: json.dump({'files':[]}, f, indent=2)

def read():
    with open(DB) as f: return json.load(f)
def write(d):
    with open(DB,'w') as f: json.dump(d, f, indent=2)

@app.route('/')
def index():
    return jsonify(service='file-service', status='ok')

@app.route('/files', methods=['POST'])
def create_file():
    body = request.json
    db = read()
    fmeta = {
        'id': str(int(time.time()*1000)),
        'project_id': body.get('project_id'),
        'task_id': body.get('task_id'),
        'uploader_id': body.get('uploader_id'),
        'file_type': body.get('file_type'),
        'storage_path': body.get('storage_path'),
        'version': 1,
        'meta': body.get('meta', {}),
        'created_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }
    db['files'].append(fmeta); write(db)
    return jsonify(fmeta), 201

@app.route('/files/<fid>', methods=['GET'])
def get_file(fid):
    db = read()
    f = next((x for x in db['files'] if x['id']==fid), None)
    if not f: return jsonify({'error':'not found'}), 404
    return jsonify(f)

@app.route('/files/<fid>/version', methods=['POST'])
def new_version(fid):
    body = request.json
    db = read()
    f = next((x for x in db['files'] if x['id']==fid), None)
    if not f: return jsonify({'error':'not found'}), 404
    f['version'] = f.get('version',1) + 1
    f['storage_path'] = body.get('storage_path', f['storage_path'])
    write(db)
    return jsonify(f)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT',8000)))
