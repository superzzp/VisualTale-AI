import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css"

const sampleImages = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
    description: 'this is a sample description'
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
    description: 'this is a sample description'
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
    description: 'this is a sample description'
  },
];

function MyGallery(props){
  if (props.images == null) {
    return (
      <ImageGallery items={sampleImages} />
    )
  }else{
    return (
      <ImageGallery items={props.images} />
    );
  }
}

export default MyGallery;