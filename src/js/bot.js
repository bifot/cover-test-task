const { Botact, api } = require('botact')

const { token, confirmation , groupId } = require(__dirname + '/../../config.json')

const bot = new Botact({
  token,
  confirmation
})

bot.getLikes = async function (postids) {
  return api('execute', {code: `var groupId = ${groupId} ; var posts = [${postids.join(',')}];  var i = 0, l = posts.length; var result = []; while (i < l) {   var postid = posts[i];   var post = { postid: postid, likes: [] };   var offset = 0;   var likescount = 0;   var likes = API.likes.getList({ type: "post", owner_id: -groupId, item_id: postid, count: 1000, offset: offset });   post.likes.push(likes.items);   likescount = likescount + likes.items.length;   while (likescount < likes.count) { var likes = API.likes.getList({ type: "post", owner_id: -groupId, item_id: postid, count: 1000, offset: offset }); offset = offset + 1001; likescount = likescount + likes.items.length; post.likes.push(likes.items);   }   result.push(post);      i = i + 1; }  return result;  `,access_token: token}).then((res)=>{
    return res.response.filter((el)=>{

      return el.likes[0].length!=0
    }).map((el)=>{
      let likes = []
      el.likes.forEach((sub)=>{
        likes.push(...sub)
      })
      el.likes = likes
      return el
    })
    })
  
}

bot.getLikes([1,2,3,34312,4,5]).catch((err)=>{
  console.error(err)
}).then(console.log)

module.exports = bot