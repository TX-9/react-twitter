import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { postAdded, addNewPost } from "./postsSlice";

export const AddPostForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle');
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
    const dispatch = useDispatch();
    
    const users = useSelector(selectAllUsers);

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                /*
                .unwrap() function to the returned Promise, which will return a new Promise 
                that either has the actual action.payload value from a fulfilled action, 
                or throws an error if it's the rejected action. 
                This lets us handle success and failure in the component using normal try/catch logic.
                */
                await dispatch(addNewPost({title, content, user: userId})).unwrap();
                setTitle('');
                setContent('');
                setUserId('');    
            } catch (error) {
                console.error('Filed to save the post:', error);
            } finally {
                setAddRequestStatus('idle');
            }
            
        }
    }
    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ));
    
    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            </form>
        </section>
    );
};