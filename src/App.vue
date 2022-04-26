<script>

import HelloWorld from './components/HelloWorld.vue';
import AddMenu from './components/AddMenu.vue'
import Modal from './components/Modal.vue';
import { BPagination} from 'bootstrap-vue-3'
const pagination = ( page, totalItemsCount, numberOfItemsPerPage) => {
  var pagesCount = (totalItemsCount - 1) / numberOfItemsPerPage + 1;
  
  var start = (page - 1) * numberOfItemsPerPage + 1;
  var end = Math.min(start + numberOfItemsPerPage - 1, totalItemsCount);
  
  return `${start} to ${end} of ${totalItemsCount}`;
}
const fetch_retry = async (url, options, n = 3) => {
    for (let i = 0; i < n; i++) {
        try {
            return await fetch(url, options);
        } catch (err) {
            const isLastAttempt = i + 1 === n;
            if (isLastAttempt) throw err;
        }
    }
};
const Server_API_URL = `https://jsonplaceholder.typicode.com/comments/`;
const Loca_API_URL = `http://localhost:3000/comments/`;
let API_URL = Loca_API_URL;
let id = 0;
let tableCount = 0;
const getInitialItems = () => {
  GetList();
};
/*
   id: NUMBER,
   title: String,
   body: String,
   postId: 1
  */
export default {
   components: {
     BPagination,
    AddMenu,
    Modal
  },
  data() {
    return {
      currentPage:1,
      perPage:5,
      Enviroment : [Server_API_URL , Loca_API_URL],
      selectedEnviroment: Loca_API_URL,
      editO:null,
      todoId: 1,
      childMsg:{},
      edit: false,
      editing:false,
      editID: 0,
      signal: null,
      data: null,
      posts:null,
      dataStream:[],
      editItemData: {
        'id' : 'placeholderID',
        'item_name': 'placeHolderName',
        'item_body': 'placeHolderBody'
      }
      ,
    };
  },
  methods: {
    editTable(table)
    {
      this.editItemData.item_name = table.title;
      this.editItemData.item_body = table.body;
      this.editItemData.id = table.id;
      this.editing= true;
      this.editO = table
      this.editID = table.id;
      
      console.log(table);
     
    },
    onEditSubmit(i)
    {
      
      console.log("edit submited" , i)
     this.EditData(this.editItemData)
      this.editing = false;
    }
    ,
    onEditCancel()
    {
      this.editing = false;
    },
    insert(i) {
      let cindex = id++;
      this.items.push({ id: cindex, i });
      
    },
    remove(i) {
      this.items = this.items.filter((t) => t !== i);
      console.log(i);
    },
    removeFromCollection(i , to){
      console.log(i,to)
            this.dataStream = this.dataStream.filter((t) => t.id !== i.id);

      this.posts = this.posts.filter((t) => t.id !== i.id);

    },
    addToCollection(i)
    {
      //this.posts.splice()
      let current = this.posts.length;
      this.posts.splice(0, 1, i)
      //this.posts.push(i);
    },
    removePost(i){
      this.posts = this.posts.filter((t) => t !== i);
      
      console.log(i.id)
      this.deleteData(i.id)
      console.log(i);
    },
    async GetList() {
      //this.posts = null;
      let ge = await fetch_retry(API_URL);
      let v = await ge.json();
      this.dataStream= v;
      this.posts= v;
      //let e = this.currentPage = 1;
      //this.currentPage = 1;
      console.log(pagination(1, this.dataStream.length,5))
       this.getNextPage()
    },
    getNextPage()
    {
      
      let e = this.currentPage;
      let r = pagination(e, this.dataStream.length,this.perPage);
      
      console.log("current page : ", this.currentPage, "per page",this.perPage, this.rows)
      var start = (this.currentPage -1)*this.perPage;
      var end = start + this.perPage;
      this.posts = this.dataStream.slice(start,end)
    },
     getPreviousPage()
    {
      let e = this.currentPage--;
      let r = pagination(e, this.dataStream.length,5)
      console.log(r)

      //this.posts = this.dataStream.slice(this.currentPage*5,10)
    },
    async fetchData() {
      this.signal = null;
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${this.todoId}`
      );
      this.signal = await res.json();
    },
   async deleteData(i){
     
     let url = API_URL.concat(i.id)
       //this.removeFromCollection(i);
     console.log(url);
     const res = await fetch( url, {
  method: 'DELETE',
}).then(res =>  this.removeFromCollection(i)).catch(error=>alert(error))
    },
    async UploadData(i){
      
      this.signal = null;
      let body = i.desc;
      let title = i.name;

      let postId = 2
      console.log("posted$",i, "post ID", postId)
      let pa = 'http://localhost:3000/comments/';
      const res =  fetch_retry (API_URL, {
  method: 'POST',
  body: JSON.stringify({
   
    title: title,
    body: body,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },

}).then((response) => response.json()).then((json) => {console.log("server upload response" , json); this.posts.splice(0,0,json) })
.catch(error => {alert(error);});

 //this.posts.push({ postId, title: title, body: body})
},
/*
editItemData: {
        'id' : 'placeholderID',
        'item_name': 'placeHolderName',
        'item_body': 'placeHolderBody'
      }*/
    async EditData(i)
    {
    let url = API_URL.concat(i.id)
    console.log("edited data",i,url);
      fetch(url, {
  method: 'PUT',
  body: JSON.stringify({
   id: i.id,
   title: i.item_name,
    body: i.item_body,
    postId: i.postId++
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
}).then((response) => response.json()).then((json) => {console.log("server response" , json);
 //this.GetList()
//this.posts[json.id -1].body = json.body; 
//this.posts[json.id -1].name = json.title; 
const index = this.posts.findIndex(object => {
  return object.id === json.id;
});
this.posts.splice(index, 1, json)
  //addToCollection(i, json)

 })
.catch(error => {alert(error);});
    }


  },
    mounted() {
    this.GetList();
  },
  computed: {
      rows() {
        //if(this.posts)
        return this.dataStream.length
      },
      
    },
  watch: {
    currentPage(){
      this.getNextPage();
    },
    selectedEnviroment()
    {
      console.log(this.selectedEnviroment)
      API_URL = this.selectedEnviroment;
      this.posts = null
      this.GetList();
    }
  }
};
</script>

<template>
      <div class="overflow-auto">
    
        <h1 class="modal-container">Crud App</h1>   
<div  class="container">
<template v-for="branch in Enviroment">
    <input type="radio"
      :id="branch"
      :value="branch"
      name="branch"
      v-model="selectedEnviroment">
    <label :for="branch">{{ branch }}</label>
  </template>
</div>

  <div id="app">

  <div  class="container">
  
  <AddMenu @response="(msg) => { UploadData(msg);}"></AddMenu>
<modal :show="!posts" @close="showModal = false"> 
<template #header>
        <h3>Connecting to Database</h3>   
        </template>
        <template #body>
        <p>Loading Database...</p>  
        <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
  </div> 
        </template>
        </modal>
</div>

    <button @click="GetList">Get posts</button>
    <p v-if="!posts">Getting Posts...</p>
    <p v-else>{{ posts[0] }} </p>
<button @click="getNextPage"> Next page</button>

<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
      <a @click="getPreviousPage()" class="page-link" href="#" tabindex="-1">Previous</a>
    <li class="page-item disabled">
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a @click="getNextPage()" class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
   

<div class="container ">
<div class="card mt-5 ">
<div class="card-header text-white bg-info">

<h4 class="mt-2">Item List</h4>
<div style="    text-align: right;"> 
<span>Item Count: </span>
 <span v-if="posts">{{posts.length}}</span>
<div v-if="!posts" class="spinner-border" role="status">
</div>
  <span class="visually-hidden">Loading...</span>
  </div>
</div>
 <div  class="card-body">

<div v-if="!posts" class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
  </div>
<BPagination class="pagination-sm"
      v-model="currentPage"
      :total-rows="dataStream.length"
      :per-page="perPage"
      aria-controls="my-table"
    ></BPagination>
<table  class="table table-hover">
  <thead class="table">
    <tr >
      <th scope="col">ID</th>
      <th scope="col">Name</th>
      <th scope="col">Desc</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  
  <TransitionGroup name="list" tag="tbody">
  
  <tr v-for="itr in posts" :key="itr.id">
              <template v-if="editing && editID ==itr.id">
                    <th>
                      {{ itr.id }}
                    
                    </th>
                    
                    <td>
                      <input class="dataEntry" v-model="editItemData.item_name" type="text"/>
                    </td>

                    <td>
                      <input class="dataEntry" v-model="editItemData.item_body" type="text"/>
                    </td>
                
                </template>

                <template v-else>
                
      <th scope="row">{{itr.id}}</th >
      <td >{{itr.name}}</td>
      <td>{{itr.body}}</td>

                </template>
      
      <td class="grid" >
      
  
                <template v-if="editing && editID == itr.id">

                <button  @click=" onEditSubmit(itr)" class="me btn btn-outline-success"> <i class="bi bi-check2"></i> </button>
                <button  @click=" onEditCancel(itr)" class="me btn btn-outline-danger"> <i class="bi bi-x-circle"></i></button>

                </template>
                <template v-else>
                <button  @click="editTable(itr)" class="me btn btn-outline-secondary"> <i class="bi bi-pencil-square"></i> </button>
                <button  @click=" deleteData(itr)" class="me btn btn-outline-danger"> <i class="bi bi-trash3"></i></i></button>
                </template>

                </td>
  </tr>
  </TransitionGroup>
</table>
</div>
</div>
</div>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
.card
{
  box-shadow: 0 2px 8px rgb(0 0 0 / 33%);
}
select {
  float: left;
  margin: 0 1em 1em 0;
  width: 14em;
}
.item {
  width: 100%;
  height: 120px;
  text-align: left;
  background-color: #f3f3f3;
  border: 1px solid #666;
  box-sizing: border-box;
}
.td_item
{
  min-width: 250px; 
  max-width: 250px
  
}
th{
    vertical-align: middle;

}
td
{
  vertical-align: middle;
  margin : 12px;
  
}


td
{
  margin : 12px;
  max-width:50px
}
span + span
{
  font-size: 32px
}
button + button
{
  margin : 12px;
}

@media (max-width: 760px) {
  .dataEntry
{
max-width : 60px
}
}

  .list-move,
 .list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
