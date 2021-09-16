import React from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState([""]);
  const [editIndex, setEditIndex] = React.useState(null);
  const [OnEditData, setOnEditData] = React.useState(false);

  const fetchData = async () => {
    const result = await axios.get("http://localhost:3001/posts");
    console.log("🚀 ~ file: index.js ~ line 11 ~ fetchData ~ result", result);
    setData(result.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onChangeTag = (e, index) => {
    let tagswap = tags;
    tagswap[index] = e.target.value;
    setTags([...tagswap]);
  };

  const onDeleteData = async (id) => {
    const newTodos = [...data];
    newTodos.splice(id, 1);
    setData(newTodos);
    await axios.delete(`http://localhost:3001/posts/${id}`);
    fetchData();
  };

  const handleSubmitPut = async (e) => {
    const user = {
      title: title,
      tag: tags,
    };
    await axios.put(`http://localhost:3001/posts/${editIndex}`, user);
    fetchData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      title: title,
      tag: tags,
    };
    await axios.post(`http://localhost:3001/posts`, user);
    fetchData();
  };

  return (
    <div style={{ maxWidth: "720px", margin: "3rem auto" }}>
      <>
        <button type="button" onClick={() => setTags([...tags, ""])}>
          Add Link
        </button>

        <br></br>
        <br></br>

        <h1>Edit Mode</h1>
        {OnEditData && (
          <div>
            <input name="title" type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
            {tags.map((ele, index) => {
              return (
                <div key={index}>
                  <>
                    <input name="tag" type="text" value={tags[index]} placeholder="Enter EP." onChange={(e) => onChangeTag(e, index)} />
                  </>
                </div>
              );
            })}
          </div>
        )}

        <br></br>
        <br></br>

        <button
          type="button"
          onClick={() => {
            handleSubmitPut();
            setOnEditData(false);
            setTags([""]);
            setTitle("");
          }}
        >
          Edit Send
        </button>
      </>

      <hr></hr>

      <>
        <button type="button" onClick={() => setTags([...tags, ""])}>
          Add Link
        </button>

        <br></br>
        <br></br>

        <h1>Input Mode</h1>
        {!OnEditData && (
          <div>
            <input name="title" type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
            {tags.map((ele, index) => {
              return (
                <div key={index}>
                  <input name="tag" type="text" value={ele.tags} placeholder="Enter EP." onChange={(e) => onChangeTag(e, index)} />
                </div>
              );
            })}
          </div>
        )}

        <br></br>
        <br></br>

        <button
          type="button"
          onClick={(e) => {
            // setTags([]);
            handleSubmit(e);
          }}
        >
          Send
        </button>
      </>

      <hr></hr>

      <div>
        <p>Show</p>
        {data.map((ele, i) => {
          return (
            <div key={i}>
              <p>
                {ele.title} - {ele.tag.join(", ")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTitle(ele.title);
                    setTags([...ele.tag]);
                    setEditIndex(ele.id);
                    setOnEditData(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteData(ele.id);
                  }}
                >
                  Delete
                </button>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
