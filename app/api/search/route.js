import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';
import User from '@models/user';

export const GET = async(req) => {
    const url = new URL(req.url)

  const searchQuery = url.searchParams.get('q')
  const findCommentsByUser = async () => {
    const users = await User.find({ username: { $regex: searchQuery, $options: 'i' } });
    const userIds = users.map(user => user._id);
    const prompts = await Prompt.find({ creator: { $in: userIds } }).populate('creator');
    return prompts;
}
    try {
        await connectToDB();
        const searchResults = await Promise.all([
            findCommentsByUser(),
            Prompt.find({ prompt: { $regex: searchQuery, $options: 'i' } }).populate('creator'),
            Prompt.find({ tag: { $regex: searchQuery, $options: 'i' } }).populate('creator')
          ]);
      
          const [commentsByUser, commentsByText, commentsByTag] = searchResults;

          const combinedComments = [...commentsByUser, ...commentsByText, ...commentsByTag].filter((prompt, index, self) => {
            const commentIdString = prompt._id.toString();
            return index === self.findIndex(c => c._id.toString() === commentIdString);
          });
      
          console.log(commentsByUser, 'search')

     return new Response(JSON.stringify(combinedComments), {status: 200})
        // const prompts = await Prompt.find({}).populate('creator');
        // return new Response(JSON.stringify(prompts), {status: 200})
    }catch(error){
        return new Response('Failed to fetch prompts', {status: 500})
    }
}