import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
const RecipeAdminCard = ({item,index,setReload}) => {

    const [tags,setTags] = useState({});
    const [ownerTags,userOwnerTags] = useState({});

    useEffect(() => {
        if(item){
            let tempTags = {}
            item?.tags?.forEach(infor => {
                tempTags = {
                    ...tempTags,
                    [infor.k]:infor.v
                }
            })
            setTags(tempTags);

            let tempownerTags = {}
            item?.owner?.tags?.forEach(infor => {
                tempownerTags = {
                    ...tempownerTags,
                    [infor.k]:infor.v
                }
            })
            userOwnerTags(tempownerTags);
        }
    },[item]);

    const handleChangeStatus = async () => {
        try{
            await axios.post(`/admin/recipe/${item?._id}`,{
            },{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Change status successfully!",
                showConfirmButton: false,
                timer: 1500
            })
            setReload(pre => !pre)
        }
        catch(err){

        }
    }
    return (
        <tr key={item?._id + "recipe"} className="alert" role="alert">
            <td className="border-bottom-0-custom">
                {index + 1}
            </td>
            <td className="d-flex align-items-center border-bottom-0-custom">
                <div className="img">
                    <img style={{width:"42px",height:"42px",borderRadius:"50%"}} src={tags?.image || 'https://res.cloudinary.com/sttruyen/image/upload/v1694421667/ksjctjx7rrwocptprfdx.jpg' } />
                </div>
                <div className="pl-3 email">
                    <span>
                        <Link to='/'>
                            {item?.name}
                        </Link>
                    </span>
                    <span>Added:{moment(item?.createdAt).fromNow()}</span>
                </div>
            </td>
            <td className="border-bottom-0-custom">
                <div className="img">
                <img style={{width:"42px",height:"42px",borderRadius:"50%"}} src={ownerTags?.image || 'https://res.cloudinary.com/sttruyen/image/upload/v1694421667/ksjctjx7rrwocptprfdx.jpg' } />
                </div>
                <div className="pl-3 email">
                    <span>
                        <Link to={`/${item?.owner?._id}/profile`}>
                            {item?.owner?.name}
                        </Link>
                    </span>
                </div>
            </td>
            <td className="status border-bottom-0-custom"><span className={item?.status === 'active' ? 'active' : 'inactiveColor'}>
                {item?.status}
                </span></td>
            <td className="border-bottom-0-custom">
                <button onClick={handleChangeStatus} style={{ marginLeft: "5px", height: "30px", fontSize: "12px" }} type="button" className="btn btn-danger">
                    Change status
                </button>
            </td>
        </tr>
    )
}

export default RecipeAdminCard