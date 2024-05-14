export const feedDetailQuery = (pinId: string) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    _id,
    title,
    category,
    description,
    _createdAt,
    "commentCount": count(comments),
    comments[]{
      comment,
      _createdAt,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const feedQuery =  `*[_type == "pin"] | order(_createdAt desc) {
  _id,
  title,
  category,
  description,
  _createdAt,
  "commentCount": count(comments),
  comments[]{
    comment,
    _key,
    postedBy->{
      _id,
      userName,
      image
    },
  }
}`;


export const newsQuery = () => {    
  const query = `*[_type == "post" && status == 'active'] | order(_createdAt desc){
    _id,
    title,
    body
  }`;
  
  return query;
};

export const marketQuery = () => {    
  const query = `*[_type == "market"] | order(_createdAt desc){
    _id,
    currencyName,
    currencySymbol,
    sellPrice,
    buyPrice
  }`;
  
  return query;
};

export const marketCommentCountQuery = `count(*[_type == 'marketComment'])`

export const marketCommentQuery =  `*[_type == "marketComment"] | order(_createdAt desc) {
  _id,
  comment,
  _key,
  postedBy->{
    _id,
    userName,
    image
  },
}`;
