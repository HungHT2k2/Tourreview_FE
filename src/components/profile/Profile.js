import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './style.scss'
import { useNavigate, useParams } from 'react-router-dom'
import OwnRecipeCard from '../card/OwnRecipeCard';
import RecipeCard from '../card/RecipeCard';
import axios from 'axios'
import Swal from 'sweetalert2';
const Profile = () => {
    const [type, setType] = useState("");
    const [edit, setEdit] = useState(false);

    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const followingRef = useRef(false);

    const [reload, setReload] = useState(false);

    const nameRef = useRef();
    const addressRef = useRef();
    const aboutMeRef = useRef();

    const imageRef = useRef('');


    const onDrop = useCallback(files => {
        const file = files[0];
        const reader = new FileReader();
        imageRef.current = file;
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            setImage(base64String);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }, [])

    const [image, setImage] = useState('');

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const [userTagObj, setUserTagObj] = useState({});

    const { slug } = useParams();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (slug) {
            axios.get(`/user/profile/${slug}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
                .then(res => {

                    let userTag = {};
                    if (res.data?.user?.your_following) {
                        followingRef.current = res.data?.user.your_following.includes(slug);
                    }
                    res.data?.user?.tags?.forEach(item => {
                        userTag = {
                            ...userTag,
                            [item?.k]: item?.v
                        }
                    })
                    res.data.user.followings = res.data?.user?.followings.map(item => {
                        let tempTag = {};
                        item?.tags?.forEach(item => {
                            tempTag = {
                                ...tempTag,
                                [item?.k]: item?.v
                            }
                        })
                        return {
                            ...item,
                            tags: tempTag
                        }
                    })
                    setUserTagObj({
                        ...userTag
                    });
                    setUser(res.data.user);
                    setImage(userTag?.image)
                })
                .catch(err => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: err?.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        }
    }, [slug, reload])

    const handleEditProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            let urlImage = "";
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
            const tags = [
                {
                    k: "address",
                    v: addressRef.current.value
                },
                {
                    k: "image",
                    v: urlImage
                },
                {
                    k: "about_me",
                    v: aboutMeRef.current.value
                }
            ]
            const data = await axios.post(`/user/update/${slug}`, {
                tags,
                name: nameRef.current.value
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: data?.data?.message,
                showConfirmButton: false,
                timer: 1500
            })
            setEdit(false);
            setReload(pre => !pre);
        }
        catch (err) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: err?.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await axios.post(`/user/f_m/${slug}`, {

            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: data?.data?.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setReload(pre => !pre);
        }
        catch (err) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: err?.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const handleUnFollow = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const data = await axios.post(`/user/f_m/${id}`, {
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: data?.data?.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setReload(pre => !pre);
        }
        catch (err) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: err?.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className='profile'>
            <section style={{ backgroundColor: '#E1E4EB' }}>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    {
                                        edit ? <div class="image-holder">
                                            <div style={{
                                                width: '100%',
                                                height: "200px", border: "1px solid rgba(0,0,0,0.1)"
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
                                                        <img style={{ width: "100%", height: "200px", objectFit: "cover" }} src={`data:image/jpeg;base64,${image}`} alt="" />
                                                }
                                            </div>
                                        </div> :
                                            <img src={userTagObj?.image || 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'} alt="avatar" className="rounded-circle img-fluid" style={{ width: '150px' }} />
                                    }
                                    <h5 className="my-3">{user?.name}</h5>
                                    <p className="text-muted mb-1">{user?.email}</p>
                                    {user?.owner ? (!edit ?
                                        <div className="d-flex justify-content-center mb-2">
                                            <button onClick={() => {
                                                setEdit(true);
                                            }} style={{ backgroundColor: "#93E2BB", border: "none" }} type="button" className="btn btn-primary">Sửa thông tin</button>
                                            <button onClick={() => {
                                                navigate('/recipe/create');
                                            }} style={{ border: "none", marginLeft: "10px" }} type="button" className="btn btn-secondary">Thêm công thức</button>
                                        </div> :
                                        <div className="d-flex justify-content-center mb-2">
                                            <button onClick={() => {
                                                handleEditProfile();
                                            }} style={{ backgroundColor: "#93E2BB", border: "none", marginRight: "10px" }} type="button" className="btn btn-primary">Xác nhận</button>
                                            <button onClick={() => {
                                                setEdit(false);
                                            }} type="button" className="btn btn-secondary">Hủy</button>
                                        </div>) :
                                        <button onClick={handleFollow} style={{ backgroundColor: "#93E2BB", border: "none" }} type="button" className="btn btn-primary">{followingRef.current ? 'Đang theo dõi' : 'Theo dõi'}</button>

                                    }
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush rounded-3">
                                        <li className="list-group-item p-3">
                                            <h5 className="mb-2">About Me</h5>
                                            {!edit ? <p className="mb-0">{userTagObj?.about_me || "None"}</p> :
                                                <textarea ref={aboutMeRef} className='text-muted mb-0 custom_input_profile' defaultValue={userTagObj?.about_me || "None"} type='text' />
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Full Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {!edit ?
                                                <p className="text-muted mb-0">{user?.name}</p>
                                                :
                                                <input ref={nameRef} className='text-muted mb-0 custom_input_profile' defaultValue={user?.name} type='text' />
                                            }
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user?.email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Address</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {!edit ?
                                                <p className="text-muted mb-0">{userTagObj?.address || "None"}</p>
                                                :
                                                <input ref={addressRef} className='text-muted mb-0 custom_input_profile' defaultValue={userTagObj?.address || "None"} type='text' />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: "10px" }} className='card mb-4'>
                                <div className='btn_custom_profile'>
                                    <div>
                                        <div onClick={() => {
                                            setType("");
                                        }} className={type === '' ? 'active' : ''}>
                                            <i>Công thức của mình</i>
                                        </div>
                                        <div className={type === 'love' ? 'active' : ''} onClick={() => {
                                            setType("love");
                                        }}>
                                            <i>Công thức yêu thích</i>
                                        </div>
                                        <div className={type === 'follow' ? 'active' : ''} onClick={() => {
                                            setType("follow");
                                        }}>
                                            <i>Đang theo dõi</i>
                                        </div>
                                    </div>
                                </div>
                                {type === '' ?
                                    <div className='row'>
                                        {user?.ownerRecipes?.map(item =>
                                            <div key={item?._id + "ownRecipe"} style={{ marginBottom: "20px" }} className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                                <OwnRecipeCard item={item} user={user} />
                                            </div>
                                        )}
                                    </div> :
                                    type === "love" ? <div className='row'>
                                        {user?.favoriteRecipes?.map(item => {
                                            const img = item.tags?.find((el) => el.k === "image");
                                            return <div key={item?._id + "ownRecipe"} style={{ marginBottom: "20px" }} className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                                <RecipeCard item={item} image={img?.v} reload={() => setReload(pre => !pre)} />
                                            </div>


                                        })}

                                    </div> : <div className='row'>
                                        {user?.followings?.map(item =>
                                            <div key={item?._id + "fowllowing"} style={{ marginBottom: "20px" }} className="col-xl-6 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                                <section style={{ backgroundColor: "#9de2ff", height: "250px", borderRadius: "30px" }}>
                                                    <div className="container custom_py-5 h-100">
                                                        <div className="row d-flex align-items-center">
                                                            <div className="col col-md-9 col-lg-7 col-xl-5">
                                                                <div className="card" style={{ borderRadius: "15px" }}>
                                                                    <div style={{ height: "150px" }} className="card-body p-4">
                                                                        <div className="d-flex text-black">
                                                                            <div className="flex-shrink-0">
                                                                                <img src={item?.tags?.image ? item?.tags?.image : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"}
                                                                                    alt="Generic placeholder image" className="img-fluid"
                                                                                    style={{ width: "100px", height: "80px", objectFit: "cover" }} />
                                                                            </div>
                                                                            <div className="flex-grow-1 ms-3">
                                                                                <h5 className="mb-1">{item?.name}</h5>
                                                                                <p className="mb-2 pb-1" style={{ color: "#2b2a2a" }}>{item?.ownerRecipes?.length > 0 ? "Chief" : "User"}</p>
                                                                                <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                                                                                    style={{ backgroundColor: "#efefef" }}>
                                                                                    <div>
                                                                                        <p className="small text-muted mb-1">Recipes</p>
                                                                                        <p className="mb-0">{item?.ownerRecipes?.length}</p>
                                                                                    </div>
                                                                                    <div className="px-3">
                                                                                        <p className="small text-muted mb-1">Followers</p>
                                                                                        <p className="mb-0">{item?.followers?.length}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="d-flex pt-1">
                                                                                    <button onClick={() => handleUnFollow(item?._id)} type="button" className="btn btn-primary flex-grow-1">Bỏ theo dõi</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>)}
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile