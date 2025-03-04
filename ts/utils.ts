// function showFormLoader(id:string){
        // append the id of the current modal toggled to the -form-loader to get the specific loader
    //     const form = <HTMLFormElement>document.getElementById(id); 
    //     const loader = document.getElementById(currentId + '-form-loader');
    //     if(form.checkValidity()){
    //       loader.classList.remove('invisible');
          // form.submit();
    //     } 
    //  }

async function fetchJSONData(url: string){
      try{
      const response = await fetch(url);
      if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); 
      return data;   
      }
      catch(e){
         console.log('Error fetching data ', e) 
      }
}

type Subscriber = { 
  update: (data: any)=>void; 
};
class CategoryPublisher{
  subscribers: Subscriber[] = [];
  async fetchLatest(){
      const data = await fetchJSONData('/api/categories/')
      this.notifySubscribers(data);
  }
  subscribe(subscriber: Subscriber){
      this.subscribers.push(subscriber);
  }
  
  unsubscribe(subscriber: Subscriber){
      this.subscribers = this.subscribers.filter((item)=>item != subscriber);  
  }

  notifySubscribers(data: any){
      this.subscribers.forEach((subscriber)=>{subscriber.update(data)})
  }
}

const categoryPublisher = new CategoryPublisher();

const getSidebar = (()=>{
    let instance = undefined; 
    return ():DrawerInstance =>{
        if(instance){
            return instance; 
        }
        
        instance = window['FlowbiteInstances']._instances.Drawer['separator-sidebar']; 
        return instance;
    };
 })(); 

 function getDropdown(id:string){
    return window['FlowbiteInstances']._instances.Dropdown[id];
 }

 class StatSummary{
    currentType:string = 'weekly'; 
    fetch(type:string){
        // because #statSummary Element will not be present when the request has not been completed we shouldn't attempt to get it from the DOM again
        if(type != this.currentType){
            this.currentType = type;
            document.getElementById('statSummary').outerHTML = router.routes['/statSummarySkeleton/'];
            htmx.ajax('GET', '/components/statSummary/?type='+ type, {
                target: '#statSummarySkeleton',
                swap:'outerHTML'
        })
        }
    }
 }

 const statSummary = new StatSummary();