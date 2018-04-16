# API File Share
API para compartilhar arquivos em NodeJs

```shel
git clone https://github.com/mayconrebordao/api-file-share.git
cd api-file-share
yarn install || npm installl
yarn start || npm start

open browser:
- http://localhost:3000/files/list
- http://localhost:3000/files/list/:nameType
- http://localhost:3000/files/upload
- http://localhost:3000/files/download/:fileId
- http://localhost:3000/files/delete/:fileId