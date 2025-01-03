"use strict";
// link a modal with this class to control basic modal functionality
class BaseModal {
    constructor(id) {
        this.modal = modalManager.getModal(id);
    }
    open() {
        this.modal.open();
    }
    close() {
        this.modal.close();
    }
}
class AddProductModal extends BaseModal {
    submitForm() {
        const form = document.getElementById('add-product-form');
        if (form.checkValidity()) {
            form.submit();
        }
        else {
            form.reportValidity();
        }
    }
}
class AddCategoryModal extends BaseModal {
}
class DataFieldsModal extends BaseModal {
    constructor() {
        super(...arguments);
        // data fields 
        this.dataFields = {};
    }
    setDataField(key, value) {
        this.dataFields[key] = value;
    }
}
class FormFieldsModal extends BaseModal {
    constructor() {
        super(...arguments);
        // form fields 
        this.formFields = {};
    }
    setFormField(key, value) {
        this.formFields[key] = value;
    }
}
class ShowDetailsModal extends DataFieldsModal {
    setDetails(data) {
        const product = JSON.parse(data);
        // set data field text contents
        this.dataFields.name.textContent = product.name;
        this.dataFields.price.textContent = `GHS ${product.price.toFixed(2)}`;
        this.dataFields.category.textContent = product.category ? product.category.name : 'None';
        this.dataFields.description.textContent = product.description || 'No description';
        this.open();
    }
}
class DeleteProductModal extends DataFieldsModal {
    constructor() {
        super(...arguments);
        // form fields 
        this.formFields = {};
    }
    setFormField(key, value) {
        this.formFields[key] = value;
    }
    setDetails(data) {
        const product = JSON.parse(data);
        // set data field text contents
        this.dataFields.name.textContent = product.name;
        this.dataFields.price.textContent = `GHS ${product.price.toFixed(2)}`;
        this.dataFields.category.textContent = product.category ? product.category.name : 'None';
        this.dataFields.description.textContent = product.description || 'No description';
        // set form field values
        this.formFields.id.value = product.id.toString();
        this.formFields.date.value = product.date;
        this.open();
    }
    submitForm() {
        const form = document.getElementById('delete-product-form');
        const formData = htmx.values(form);
        const tr = htmx.find(`#product-${formData.id}`);
        const elementToReplace = htmx.closest(tr, '.record');
        elementToReplace.querySelector('.skeleton').classList.remove('hidden');
        this.close();
        htmx.ajax('POST', '/dashboard/?delete=1', {
            values: formData,
            target: elementToReplace,
            swap: 'outerHTML'
        });
    }
}
class EditProductModal extends FormFieldsModal {
    setDetails(data) {
        const product = JSON.parse(data);
        const priceParts = product.price.toString().split('.');
        this.formFields.name.value = product.name;
        this.formFields.cedis.value = priceParts[0];
        console.log(priceParts);
        if (product.category) {
            this.formFields.category.value = product.category.id.toString();
        }
        if (priceParts.length > 1) {
            this.formFields.pesewas.value = priceParts[1];
        }
        this.formFields.id.value = product.id.toString();
        this.formFields.description.value = product.description;
        this.formFields.date.value = product.date;
        setCategory(product.category);
        this.open();
    }
    submitForm() {
        const form = document.getElementById('edit-product-form');
        if (form.checkValidity()) {
            const formData = htmx.values(form);
            const tr = htmx.find(`#product-${formData.id}`);
            const elementToReplace = htmx.closest(tr, '.record');
            elementToReplace.querySelector('.skeleton').classList.remove('hidden');
            this.close();
            htmx.ajax('POST', '/dashboard/?edit=1', {
                values: formData,
                target: elementToReplace,
                swap: 'outerHTML'
            });
        }
        else {
            form.reportValidity(); // display the validation messages
        }
    }
}
const getAddProductModal = (() => {
    let instance = undefined; // just a reference to the modal if it has been called already 
    return () => {
        if (instance) {
            return instance;
        }
        instance = new AddProductModal('add-product-modal');
        return instance;
    };
})();
const getAddCategoryModal = (() => {
    let instance = undefined; // just a reference to the modal if it has been called already 
    return () => {
        if (instance) {
            return instance;
        }
        instance = new AddCategoryModal('add-category-modal');
        return instance;
    };
})();
const getDeleteProductModal = (() => {
    let instance = undefined;
    return () => {
        if (instance) {
            return instance;
        }
        instance = new DeleteProductModal('delete-product-modal');
        return instance;
    };
})();
const getShowDetailsModal = (() => {
    let instance = undefined;
    return () => {
        if (instance) {
            return instance;
        }
        instance = new ShowDetailsModal('show-details-modal');
        return instance;
    };
})();
const getEditProductModal = (() => {
    let instance = undefined;
    return () => {
        if (instance) {
            return instance;
        }
        instance = new EditProductModal('edit-product-modal');
        return instance;
    };
})();
