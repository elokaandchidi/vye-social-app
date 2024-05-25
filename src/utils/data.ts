type searchParams = {
  page: number,
  pageSize: number,
  searchTerm?: string,
}

export const feedDetailQuery = (pinId: string) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    _id,
    title,
    category,
    description,
    _createdAt,
    "comments": *[_type == "comment" && pin._ref == "${pinId}" && references(^._id)] | order(postedAt desc) {
      _id,
      "key": _id,
      name,
      comment,
      postedAt,
      likes,
      dislikes,
      "replies": *[_type == "comment" && _id in ^.replies[]._ref] | order(postedAt desc) {
        _id,
        name,
        comment,
        postedAt,
        likes,
        dislikes
      }
    }
  }`;
  return query;
};

export const feedQuery = ({page, pageSize}: searchParams) => {  
  const prev = (page - 1) * pageSize;
  const next = page * pageSize;
  
  const query = `*[_type == "pin"] | order(_createdAt desc) [${prev}...${next}]{
    _id,
    title,
    category,
    description,
    _createdAt,
    "comments": *[_type == "comment" && pin._ref == ^._id] | order(postedAt desc) {
      _id,
      "key": _id,
      name,
      comment,
      postedAt,
      likes,
      dislikes,
      "replies": *[_type == "comment" && _id in ^.replies[]._ref] | order(postedAt desc) {
        _id,
        name,
        comment,
        postedAt,
        likes,
        dislikes
      },
    },
  }`;
  
  return query;
};

export const feedSearchQuery = ({page, pageSize, searchTerm}: searchParams) => {
  const prev = (page - 1) * pageSize;
  const next = page * pageSize;
  const query = `*[_type == "pin" && category match '${searchTerm}*' || description match '${searchTerm}*'] | order(_createdAt desc) [${prev}...${next}]{
    _id,
    title,
    category,
    description,
    _createdAt,
    "comments": *[_type == "comment" && pin._ref == ^._id] | order(postedAt desc) {
      _id,
      "key": _id,
      name,
      comment,
      postedAt,
      likes,
      dislikes,
      "replies": *[_type == "comment" && _id in ^.replies[]._ref] | order(postedAt desc) {
        _id,
        name,
        comment,
        postedAt,
        likes,
        dislikes
      },
    },
  }`;

  return query;
};

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
    price,
  }`;
  
  return query;
};

export const marketCommentCountQuery = `count(*[_type == 'marketComment' && isReply == false])`

export const marketCommentQuery =  `*[_type == "marketComment" && isReply == false] | order(postedAt desc) {
  _id,
  name,
  comment,
  postedAt,
  likes,
  dislikes,
  "replies": *[_type == "marketComment" && _id in ^.replies[]._ref] | order(postedAt desc) {
    _id,
    name,
    comment,
    postedAt,
    likes,
    dislikes
  },
}`;
