import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { resizeFile, dataURIToBlob } from "../utils/imageupload";
import { nanoid } from "nanoid";
import axios from "axios";
import { Card, Row } from "react-bootstrap";

const WithCSS = () => {
  const [data, setData] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState(null);
  const [onEditData, setOnEditData] = React.useState(false);

  const FetchData = async () => {
    const { data } = await axios.get("http://localhost:3001/posts");
    setData(data);
  };

  React.useEffect(() => {
    FetchData();
  }, []);

  const UpLoadOnChangeImages = async (e) => {
    let ImagesUpload;
    ImagesUpload = e.target.files;
    let imagesArrayTotal = [];
    for (let index = 0; index < ImagesUpload.length; index++) {
      const file = ImagesUpload[index];
      const { data } = await UploadImageSubmit(file);
      imagesArrayTotal.push(data.data.url);
    }

    console.log("imagesArrayTotal", imagesArrayTotal);
    setImages(imagesArrayTotal);
  };

  const UploadImageSubmit = async (files) => {
    if (typeof files === "string") return;

    const image = await resizeFile(files);
    const newFile = await dataURIToBlob(image);

    const formData = new FormData();
    formData.append("name", nanoid());
    formData.append("image", newFile);
    const uploadPOST = await axios.post(`https://api.imgbb.com/1/upload?&key=ce22f7a1d8522fa71cd98c4c51d94552`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return uploadPOST;
  };

  const PostHandleSubmit = async () => {
    const user = {
      title: title,
      images: images,
    };

    await axios.post(`http://localhost:3001/posts`, user);
    setTitle("");
    /* setImages([]); */
    FetchData();
  };

  const EditHandleSubmit = async () => {
    const user = {
      title: title,
      images: images,
    };

    await axios.put(`http://localhost:3001/posts/${editIndex}`, user);
    setOnEditData(false);
    setTitle("");
    setImages([]);
    FetchData();
  };

  const DeleteHandleData = async (id) => {
    const newTodos = [...data];
    newTodos.splice(id, 1);
    setData(newTodos);

    await axios.delete(`http://localhost:3001/posts/${id}`);
    FetchData();
  };

  return (
    <div style={{ maxWidth: "720px", margin: "3rem auto" }}>
      <div className="mb-3">
        {onEditData && (
          <div>
            <h2>แก้ไข</h2>
            <Form.Group className="mb-3">
              <Form.Label>หัวข้อ</Form.Label>
              <Form.Control type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>รูปภาพ</Form.Label>
              <Form.Control type="file" multiple onChange={UpLoadOnChangeImages}></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" onClick={(e) => EditHandleSubmit(e)}>
              Edit
            </Button>
          </div>
        )}

        {!onEditData && (
          <div>
            <h2>โพส</h2>
            <Form.Group className="mb-3">
              <Form.Label>หัวข้อ</Form.Label>
              <Form.Control type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>รูปภาพ</Form.Label>
              <Form.Control type="file" multiple onChange={UpLoadOnChangeImages}></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" onClick={() => PostHandleSubmit()}>
              Post
            </Button>
          </div>
        )}
      </div>

      <Card>
        <Card.Body>
          <Row xs={1} md={4} className="g-4">
            {data.map((x, i) => {
              return (
                <div key={i} className="mb-3">
                  <>
                    <p>{x.title}</p>
                    <p>{x.images.length}</p>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => {
                        setTitle(x.title);
                        setImages(x.images);
                        setEditIndex(x.id);
                        setOnEditData(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => {
                        DeleteHandleData(x.id);
                      }}
                    >
                      Delete
                    </Button>
                  </>
                </div>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WithCSS;
