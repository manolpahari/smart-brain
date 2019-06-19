import React from 'react';

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
  return (
    <div>
      <p className="f3 black">This Magic Brain will detect faces in your pictures. Give it a try.</p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input type="text" className="f4 center pa2 w-70" 
          onChange={onInputChange}/>
          <button className="f4 white w-30 link grow ph3 pv2 dib bg-light-purple" 
          onClick={onPictureSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default ImageLinkForm;
