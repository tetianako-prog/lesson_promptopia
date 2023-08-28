import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';

export const GET = async(req, { params }) => {
    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate('creator');
        if(!prompt) {
            return new Response('Prompt not found', {status: 404})
        }
        return new Response(JSON.stringify(prompt), {status: 200})
    }catch(error){
        return new Response('Failed to fetch prompts', {status: 500})
    }
}


export const  PATCH = async (req, { params }) => {
    const { prompt, tag } = await req.json();
    try {
        await connectToDB();
        const response = await Prompt.findOneAndUpdate({_id: params.id}, {prompt, tag})
        return new Response(JSON.stringify(response), {status: 201})
         
    } catch(err) {
        return new Response('Failed to create new prompt', {status: 500})
    }
}

export const DELETE = async (req, { params }) => {
    try {
        await connectToDB();
        const response = await Prompt.findByIdAndRemove(params.id);
        return new Response('Prompt deleted successfully', {status: 200})
    } catch(err) {
        return new Response('Failed to delete a prompt', {status: 500})
    }
}