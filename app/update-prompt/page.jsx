'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Form from '@components/Form';
import { useSearchParams } from 'next/navigation'

const UpdatePrompt = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [submiting, setSubmiting] = useState(false)
    const [post, setPost] = useState({
        prompt: '',
        tag: ''
    });

    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    console.log(post)

    useEffect(() => {
        const getPost = async () => {
            try{
             const response = await fetch(`/api/prompt/${id}`);
             const data = await response.json();
             setPost({prompt: data?.prompt, tag: data?.tag});
            }catch(err){
                console.log(err)
            } 
        }
        if(id) getPost();
    }, [id])

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmiting(true);
        try{
            const response = await fetch(`/api/prompt/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag
                })
            })
          if(response.ok) {
            router.push('/profile')
          }  

        }catch(error){
            console.log(error)

        }finally{
            setSubmiting(false)
        }

    }
    return <Form
    type='Edit'
    post={post}
    setPost={setPost}
    submiting={submiting}
    handleSubmit={updatePrompt}/>
}

export default UpdatePrompt;