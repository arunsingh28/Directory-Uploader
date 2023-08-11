# Directory Uploader

upload any **Folder / Directory** to server using zip method. To upload a folder from clien to server create zip of the folder on client side then send it to server on route [http://localhost:3000/upload](http://localhost:3000/upload)

## Library Use

1. [adm-zip](https://www.npmjs.com/package/adm-zip)
2. [multer](https://www.npmjs.com/package/multer)
3. [express](https://www.npmjs.com/package/express)

## How to use

**Client side**

- [checkout client code](https://github.com/arunsingh28/Directory-Uploader/blob/master/client.html) 
here i use `enctype="multipart/form-data"` This is must to declare enctype without this it wont work.
```
  <form id="uploadForm" method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <input type="submit" value="Upload Folder">
    </form>
```


## Package Manager Use

I have use [pnpm](https://pnpm.io/) pacakge manager. **give it try**