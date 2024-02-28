import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select';
import moment from 'moment'
import axios from 'axios';
const AccountCard = ({user,index,setReload}) => {
    const [edit, setEdit] = useState(false);
    const [selectedOption, SetSelectedOption] = useState( { value: 'user', label: 'User' });

    let [tags,setTags] = useState({});

    const handleChange = (e) => {
        SetSelectedOption(e);
    }
    useEffect(() => {
        if(user){
            let tempTags = {};
            user?.tags?.forEach(item => {
                tempTags = {
                    ...tempTags,
                    [item.k]:item.v
                }
            })
            SetSelectedOption({
                label:user?.role,
                value:user?.role
            })
            setTags(tempTags)
        }
    },[user]);
    const colourOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'chief', label: 'Đầu bếp' },
        { value: 'user', label: 'User' },
    ];

    const handleUpdateRole = async () => {
        try{
            const token = localStorage.getItem("token");
            if(token){

                const data = await axios.post(`/user/update/${user?._id}`,{
                    role:selectedOption.value
                },{
                    headers:{
                        authorization:`Bearer ${token}`
                    }
                })
                setEdit(false)
                setReload(pre => !pre)
            }
        }
        catch(err){

        }
    }

    const handleChangeStatus = async () => {
        try{
            const token = localStorage.getItem("token");
            if(token){
                const data = await axios.post(`/user/update/${user?._id}`,{
                    status:user?.status == 'locked' ? 'opened':'locked'
                },{
                    headers:{
                        authorization:`Bearer ${token}`
                    }
                })
                setEdit(false)
                setReload(pre => !pre)
            }
        }
        catch(err){

        }
    }
    return (
        <tr className="alert" role="alert">
            <td className="border-bottom-0-custom">
                {index + 1}
            </td>
            <td className="d-flex align-items-center border-bottom-0-custom">
                <div className="img">
                    <img style={{width:"45px",height:'45px',borderRadius:"50%"}} src={tags?.image || "https://res.cloudinary.com/sttruyen/image/upload/v1694421667/sfcf5rwxxbjronvxlaef.jpg"} />
                </div>
                <div className="pl-3 email">
                    <span>
                        <Link to={`/${user?._id}/profile`}>
                            {user?.email}
                        </Link>
                    </span>
                    <span>{moment(user?.createdAt).fromNow()}</span>
                </div>
            </td>
            <td className="border-bottom-0-custom">
                {edit ? <div className='col-12'>
                    <Select
                        value={selectedOption}
                        onChange={handleChange}
                        options={colourOptions}
                        defaultValue={selectedOption}
                        placeholder="Role"
                    />
                </div> : selectedOption.value}
            </td>
            <td className="border-bottom-0-custom">{user?.ownerRecipes?.length}</td>
            <td className="border-bottom-0-custom">{user?.followers?.length}</td>
            <td className="status border-bottom-0-custom"><span className={user?.status === 'opened' ? "active" : "inactiveColor"}>
                {user?.status}
                </span></td>
            <td className="border-bottom-0-custom">
                {!edit ? <>
                    <button onClick={() => {
                        setEdit(true)
                    }} style={{ height: "30px", fontSize: "12px" }} type="button" className="btn btn-primary">
                        Sửa
                    </button>
                    <button onClick={() => {
                        handleChangeStatus()
                    }} style={{ marginLeft: "5px", height: "30px", fontSize: "12px" }} type="button" className="btn btn-danger">
                        Khóa
                    </button></> : <>
                    <button onClick={() => {
                        handleUpdateRole()
                    }} style={{ height: "30px", fontSize: "12px" }} type="button" className="btn btn-danger">
                        Đồng ý
                    </button>
                    <button onClick={() => {
                        setEdit(false)
                    }} style={{ marginLeft: "5px", height: "30px", fontSize: "12px" }} type="button" className="btn btn-secondary">
                        Hủy
                    </button></>}
            </td>
        </tr>
    )
}

export default AccountCard