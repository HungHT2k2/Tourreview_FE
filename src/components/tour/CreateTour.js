import React, { useCallback, useState, useRef, useEffect } from 'react'
import './style.scss'
import { Editor } from "react-draft-wysiwyg";
import { useDropzone } from 'react-dropzone'
import axios from 'axios';
import {
    EditorState,
    ContentState,
    convertToRaw,
    Modifier,
    convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { redirect, useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import Swal from 'sweetalert2';

const CreateTour = () => {
        const [tour_name, setTour_name] = useState('')
    const [isTourNameValid, setIsTourNameValid] = useState(true);
    const [isTour, setIsTour] = useState(true);
    const [tour_introduction, setTour_introduction] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const [content, setContent] = useState("");

    const [image, setImage] = useState('');
    const imageRef = useRef();
    const createOption = (value) => ({
        label: value,
        value: value.toLowerCase().replace(/\W/g, ''),
    });
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(acceptedFiles[0]);
        setImage(url);
        imageRef.current = file;
    }, [])



    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      }, [editorState]);
    const handleChange = (data) => {
        setEditorState(data);
    };
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
    const uploadCallback = (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "sttruyenxyz");
            // axios
            //     .post(
            //         "https://api.cloudinary.com/v1_1/sttruyen/image/upload",
            //         formData,
            //         {
            //             headers: { "X-Requested-With": "XMLHttpRequest" },
            //             onUploadProgress: (progressEvent) => {
            //                 const percentCompleted = Math.round(
            //                     (progressEvent.loaded * 100) / progressEvent.total
            //                 );
            //             },
            //         }
            //     )
            //     .then((response) => {
            //         resolve({ data: { link: response.data.secure_url } });
            //     })
            //     .catch((error) => {
            //         reject(error);
            //     });
        });
    };

    useEffect(() => {
        axios.get('/tour/common').then((response) => {

            setOptions(response.data);
        });
    }, [])
    const handleCreate = (inputValue) => {
        setIsLoading(true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setIsLoading(false);
            axios.post(
                "/tour/common", {
                key: "country",
                label: inputValue,
                value: inputValue,
            })
            setOptions((prev) => [...prev, newOption]);
            setValue(newOption);
        }, 1000);
    }
    const handleBackPage = () => {
        navigate(-1);
    }
    const handleSubmitTour = async () => {
        if (tour_name.trim() === '') {
            setIsTourNameValid(false);
            return;
        }
        const contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            setIsTour(false);
            return;
        }
        try {
            let urlImage = '';
            if (imageRef.current) {
                const formData = new FormData();
                formData.append("file", imageRef.current);
                formData.append("upload_preset", "thaianhupload");
                try {
                    const res = await axios.post(
                        "https://api.cloudinary.com/v1_1/daq52mzfl/upload",
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
            const token = localStorage.getItem('token');
            const data = await axios.post(`/tour`,
                {
                    name: tour_name, introduction: tour_introduction,
                    tours: content,
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
                }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            navigate(-1)
        }
        catch (err) {
            
        }


    }

    const [colourOptions, setColourOptions] = useState([
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' }
    ])
    return (
        <div className='create_tour_container'>
            <div class="wrapper" >
                <div class="inner">
                    <div class="image-holder">
                        <div style={{
                            width: '400px',
                            height: "400px", border: "1px solid rgba(0,0,0,0.1)"
                        }} 
                        className='d-flex justify-content-center align-items-center' {...getRootProps()}>
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
                    <div style={{ width: "800px" }} className='create_form' action="">
                        <h3 style={{ marginBottom: "30px" }}>Thêm Bài Viết</h3>
                        <div class="form-holder active w-100">
                            <textarea style={{ width: "100%", minHeight: "100px" }} type="text" placeholder="Tên địa điểm du lịch" class={`form-control ${!isTourNameValid ? 'invalid' : ''}`} onChange={e => { setTour_name(e.target.value); setIsTourNameValid(true) }} />
                        </div>
                        <div class="form-holder active">
                            <textarea style={{ width: "100%", minHeight: "200px" }} type="text" placeholder="Chọn địa điểm" class="form-control" onChange={e => setTour_introduction(e.target.value)} />
                        </div>
                    </div>
                    
                </div>
                {/* <div className='create_form-2'>
                    <div style={{ margin: "10px 0" }} class="form-holder active w-100">
                        <CreatableSelect onChange={(newValue) => setValue(newValue)}
                            isClearable
                            isLoading={isLoading}
                            onCreateOption={handleCreate}
                            options={options}
                            value={value}
                            placeholder="Chọn quốc gia"
                        />
                    </div>
                </div> */}
                <div className='tour_create'>
                    <h3 style={{ marginTop: "20px" }}>Giới thiệu về địa điểm du lịch</h3>
                    <div className={`tour_create_edit ${!isTour ? 'invalid  ' : ''}`}>
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
                    <div style={{ marginTop: "30px", marginBottom: "20px" }} className='d-flex justify-content-center' onClick={handleSubmitTour}>
                        <button>Tạo mới</button>
                    </div>
                </div>
            </div>
            <div className='back_button'>
                <button onClick={handleBackPage}> <i style={{ marginRight: "10px" }} className="fa-solid fa-arrow-left"></i>Quay lại</button>
            </div>
        </div>
    )
}

export default CreateTour