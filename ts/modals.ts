// link a modal with this class to control basic modal functionality
class BaseModal{
   modal: ModalInstance;
   constructor(id: string){
        this.modal = modalManager.getModal(id);
   }
   open(){
      this.modal.open();
   }
   
   close(){
      this.modal.close();
   }
}

class AddProductModal extends BaseModal{
   submitForm(){
       const form = <HTMLFormElement>document.getElementById('add-product-form');
       if(form.checkValidity()){
           form.submit();
       }
       else{
           form.reportValidity();
       }
   }
}

class AddCategoryModal extends BaseModal{
}

class DataFieldsModal extends BaseModal{
    
}
class DeleteProductModal extends BaseModal{
    // fields 
    dataFields: {[key: string]: HTMLElement} = {};
    formFields: {[key: string]: HTMLInputElement} = {};

    setDataField(key:string, value:HTMLElement){
        this.dataFields[key] = value;
    }
    setFormField(key: string, value:HTMLInputElement){
         this.formFields[key] = value;
    }
    setDetails(data: string){
        const product: Product = JSON.parse(data);
        // set data field text contents
        this.dataFields.name.textContent = product.name;
        this.dataFields.price.textContent = `GHS ${product.price.toFixed(2)}`;
        this.dataFields.category.textContent = product.category? product.category.name: 'None';
        this.dataFields.description.textContent = product.description || 'No description'; 
        // set form field values
        this.formFields.id.value = product.id.toString(); 
        this.formFields.date.value = product.date;
        this.open();   
    }
    submitForm(){
        const form = <HTMLFormElement>document.getElementById('delete-product-form');
        const formData = htmx.values(form);
        const tr = htmx.find(`#product-${formData.id}`);
        const elementToReplace = <HTMLElement>htmx.closest(tr, '.record');
        elementToReplace.querySelector('.skeleton').classList.remove('hidden');
        this.close();
        htmx.ajax('POST', '/dashboard/?delete=1', {
         values: formData,
         target: elementToReplace,
         swap: 'outerHTML'
        });
    }
}


const getAddProductModal = (()=>{
   let instance = undefined; // just a reference to the modal if it has been called already 
   return ()=>{
       if(instance){
           return instance; 
       }
       
       instance = new AddProductModal('add-product-modal');
       return instance;
   };
})();

const getAddCategoryModal = (()=>{
   let instance = undefined; // just a reference to the modal if it has been called already 
   return ()=>{
       if(instance){
           return instance; 
       }
       
       instance = new AddCategoryModal('add-category-modal');
       return instance;
   };
})(); 

const getDeleteProductModal = (()=>{
   let instance = undefined; 
   return ()=>{
       if(instance){
           return instance; 
       }
       
       instance = new DeleteProductModal('delete-product-modal');
       return instance;
   };
})(); 