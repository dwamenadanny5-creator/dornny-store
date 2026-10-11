function watchVideo(id){
  let v=videos.find(x=>x.id==id);if(!v) return;
  currentWatchVideo=v;
  // Add viewer count
  let viewsMap=getVideoViews(); viewsMap[v.id]=(viewsMap[v.id]||0)+1; localStorage.setItem('dornny_video_views',JSON.stringify(viewsMap));
  v.views=(v.views||0)+1;
  let realViews=(viewsMap[v.id]||0)+(v.views||0)-1;
  let likesMap=getVideoLikes(); let likedMap=getVideoLiked(); let subs=getSubs();
  let realLikes=likesMap[v.id]!==undefined?likesMap[v.id]: (v.likes||0);
  let isLiked=likedMap[v.id]||false;
  let isSubbed=subs.includes(v.uploader);

  document.getElementById('watchTitle').innerText=v.title;
  document.getElementById('watchTitle2').innerText=v.title;
  document.getElementById('watchCat').innerHTML=`${v.cat.toUpperCase()} • ${v.uploader} • 👁️ ${realViews.toLocaleString()} viewers • ❤️ ${realLikes} likes`;

  let player=document.getElementById('watchPlayer');
  if(v.url.includes('youtube.com')||v.url.includes('youtu.be')){
    let ytId=v.url.includes('youtu.be')?v.url.split('/').pop().split('?')[0]:new URL(v.url).searchParams.get('v');
    player.innerHTML=`<iframe class="w-full h-[240px]" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen></iframe>`;
  }else{
    player.innerHTML=`<video controls autoplay class="w-full h-[240px] bg-black" src="${v.url}"></video>`;
  }
  // Add action bar under player
  let existingBar=document.getElementById('watchActions');
  if(existingBar) existingBar.remove();
  let actionBar=document.createElement('div');
  actionBar.id='watchActions';
  actionBar.className='p-3 bg-[#111] border-t border-[#222] flex gap-2 flex-wrap';
  actionBar.innerHTML=`
    <button onclick="likeVideo(${v.id}, event, true)" class="flex-1 ${isLiked?'bg-red-600':'bg-[#222]'} text-white py-2.5 rounded-full text-[11px] font-bold border">${isLiked?'❤️ Liked':'🤍 Like'} ${realLikes}</button>
    <button onclick="downloadCurrentVideo()" class="flex-1 bg-white text-black py-2.5 rounded-full text-[11px] font-black">⬇️ Download</button>
    <button onclick="shareVideo()" class="flex-1 bg-[#222] text-white py-2.5 rounded-full text-[11px] font-bold border">📤 Share</button>
    <button onclick="subscribeChannel('${v.uploader.replace(/'/g,"\\'")}'); renderVideos();" class="w-full ${isSubbed?'bg-gray-600':'bg-red-600'} text-white py-2.5 rounded-full text-[11px] font-bold mt-1">${isSubbed?'✅ Subscribed to '+v.uploader:'🔔 Subscribe to '+v.uploader}</button>
    <div class="w-full text-center text-[10px] text-gray-400 mt-1">👁️ ${realViews.toLocaleString()} viewers watching now</div>
  `;
  document.getElementById('watchPlayer').after(actionBar);
  document.getElementById('watchPage').style.display='block';
  renderVideos();
}

function likeVideo(id, ev, fromWatch=false){
  if(ev) ev.stopPropagation();
  let likedMap=getVideoLiked(); let likesMap=getVideoLikes();
  let v=videos.find(x=>x.id==id); if(!v) return;
  let currentLikes=likesMap[id]!==undefined?likesMap[id]:(v.likes||0);
  if(likedMap[id]){
    likedMap[id]=false; likesMap[id]=Math.max(0,currentLikes-1); toast('💔 Unliked');
  }else{
    likedMap[id]=true; likesMap[id]=currentLikes+1; toast('❤️ Liked!');
  }
  localStorage.setItem('dornny_video_liked',JSON.stringify(likedMap));
  localStorage.setItem('dornny_video_likes',JSON.stringify(likesMap));
  renderVideos();
  if(fromWatch && currentWatchVideo && currentWatchVideo.id==id){
    let realViews=(getVideoViews()[id]||0)+(v.views||0);
    document.getElementById('watchCat').innerHTML=`${v.cat.toUpperCase()} • ${v.uploader}
