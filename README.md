# API File Share
API para compartilhar arquivos em NodeJs, também é a provedora de recurso da aplicação [host-share](https://github.com/mayconrebordao/host-share)

```shel
git clone https://github.com/mayconrebordao/api-file-share.git
cd api-file-share
yarn install || npm installl
yarn start || npm start
```
open browser:
- http://localhost:3000/files/list for list all files
- http://localhost:3000/files/list/:nameType for list a specific type file
- http://localhost:3000/files/upload for upload one or more file
- http://localhost:3000/files/download/:fileId for download one file
- http://localhost:3000/files/delete/:fileId for delete one file

