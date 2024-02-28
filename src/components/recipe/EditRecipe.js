import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import {
    EditorState,
    ContentState,
    convertToRaw,
    Modifier,
    convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom"
import CreatableSelect from 'react-select/creatable';
import Swal from "sweetalert2";

const EditRecipe = () => {
    const { id } = useParams();
    const [dataRecipe, setDataRecipe] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');

    const [recipe_name, setRecipe_name] = useState('')
    const [recipe_introduction, setRecipe_introduction] = useState('')
    const [recipe, setRecipe] = useState('')
    const [image, setImage] = useState('');

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const imageRef = useRef();

    const createOption = (value) => ({
        label: value,
        value: value.toLowerCase().replace(/\W/g, ''),
    });
    const handleCreate = (inputValue) => {
        setIsLoading(true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setIsLoading(false);
            axios.post(
                "/recipe/common", {
                key: "country",
                label: inputValue,
                value: inputValue,
            })
            setOptions((prev) => [...prev, newOption]);
            setValue(newOption);
        }, 1000);
    }
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(acceptedFiles[0]);
        setImage(url);
        imageRef.current = file;
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    useEffect(() => {
        axios.get(`/recipe/${id}`).then(data => {
            let newTags = {};
            data?.data?.recipe?.tags?.forEach(item => {
                newTags = {
                    ...newTags,
                    [item.k]: item.v
                }
            })
            setDataRecipe({
                ...data?.data?.recipe,
                tags: newTags
            });
            console.log(newTags)
            setImage(newTags?.image);
        })
    }, [])

    useEffect(() => {
        axios.get('/recipe/common').then((response) => {
            setOptions(response.data);
        });
    }, [])

    useEffect(() => {
        if (dataRecipe && dataRecipe.recipes) {
            const convertedContent = convertFromHTML(dataRecipe.recipes);
            const contentState = ContentState.createFromBlockArray(convertedContent);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [dataRecipe]);


    const handleChange = (data) => {
        setEditorState(data);
    };
    const [content, setContent] = useState("");
    useEffect(() => {
        setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }, [editorState]);

    const onImageUpload = (file) => {
        return new Promise((resolve, reject) => {
            uploadCallback(file)
                .then((response) => {
                    // setUploadImage(true);
                    resolve({ data: { link: response.data.link } });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    const navigate = useNavigate();
    const uploadCallback = (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "sttruyenxyz");

        });
    };
    const handleBackPage = () => {
        navigate(-1);
    }

    const handleEditRecipe = async (id) => {
        let urlImage = '';
        if (imageRef.current) {
            const formData = new FormData();
            formData.append("file", imageRef.current);
            formData.append("upload_preset", "sttruyenxyz");
            try {
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
                    formData
                );
                urlImage = "https:" + res.data.url.split(":")[1];
            } catch (err) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: err?.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                return;
            }
        }
        axios.put(`/recipe/${id}`, {
            name: recipe_name.trim() == "" ? dataRecipe.name : recipe_name,
            introduction: recipe_introduction.trim() == "" ? dataRecipe.introduction : recipe_introduction,
            recipes: content,
            tags: [
                {
                    k: "image",
                    v: urlImage,

                },
                {
                    k: "country",
                    v: value.value,

                }
            ]

        }).then(() => { navigate(-1) })
    }

    return (
        <div className='create_recipe_container'>
            <div class="wrapper">
                <div class="inner">
                    <div class="image-holder">
                        <div style={{
                            width: '400px',
                            height: "500px", border: "1px solid rgba(0,0,0,0.1)"
                        }} className='d-flex justify-content-center align-items-center' {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                !image ? <div>
                                    <div className='d-flex justify-content-center'>
                                        <i style={{ fontSize: "50px", color: "rgba(0,0,0,0.7)" }} className="fa-solid fa-image"></i>
                                    </div>
                                    <div>
                                        <i>
                                            Thêm ảnh tại đây
                                        </i>
                                    </div>
                                </div> :
                                    <img style={{ width: "400px", height: "500px", objectFit: "cover" }} src={image} alt="" />
                            }
                        </div>
                    </div>
                    <div style={{ width: "400px" }} className='create_form' action="">
                        <h3 style={{ marginBottom: "30px" }}>Tạo công thức</h3>
                        <div class="form-holder active w-100">
                            <textarea style={{ width: "100%", minHeight: "100px" }} type="text" class={`form-control `} defaultValue={dataRecipe?.name} onChange={e => { setRecipe_name(e.target.value); }} />
                        </div>
                        <div class="form-holder active">
                            <textarea style={{ width: "100%", minHeight: "200px" }} type="text" class="form-control" defaultValue={dataRecipe?.introduction} onChange={e => setRecipe_introduction(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className='create_form-2'>
                    <div style={{ margin: "10px 0" }} class="form-holder active w-100">
                        {dataRecipe && options &&
                            <CreatableSelect onChange={(newValue) => setValue(newValue)}
                                isClearable
                                isLoading={isLoading}
                                onCreateOption={handleCreate}
                                options={options}
                                value={value}
                                defaultValue={{
                                    value: dataRecipe?.tags?.country,
                                    label: dataRecipe?.tags?.country
                                }}
                                placeholder="Chọn quốc gia"
                            />}
                    </div>
                </div>

                <div className='recipe_create'>
                    <h3 style={{ marginTop: "20px" }}>Công thức</h3>
                    <div className={`recipe_create_edit `}>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={handleChange}
                            wrapperClassName="editor-wrapper"
                            editorClassName="message-editor"
                            toolbarClassName="message-toolbar"
                            toolbar={{
                                options: [
                                    "inline",
                                    "blockType",
                                    "fontSize",
                                    "list",
                                    "textAlign",
                                    "image",
                                    "emoji",
                                    "link",
                                    "history",
                                ],

                                image: {
                                    uploadEnabled: true,
                                    uploadCallback: onImageUpload,
                                    previewImage: true,
                                    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                    alt: { present: false, mandatory: false },
                                    defaultSize: {
                                        height: "200px",
                                        width: "200px",
                                    },
                                },
                            }}
                        />
                    </div>
                    <div style={{ marginTop: "30px", marginBottom: "20px" }} className='d-flex justify-content-center' >
                        <button onClick={() => handleEditRecipe(id)}>update</button>
                    </div>
                </div>
            </div>
            <div className='back_button'>
                <button onClick={handleBackPage}> <i style={{ marginRight: "10px" }} className="fa-solid fa-arrow-left"></i>Quay lại</button>
            </div>
        </div>
    )
}
export default EditRecipe