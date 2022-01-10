!function(){class e extends Snowboard.Singleton{listens(){return{ready:"ready",ajaxSetup:"onAjaxSetup"}}ready(){this.attachHandlers(),this.disableDefaultFormValidation()}dependencies(){return["request","jsonParser"]}destructor(){this.detachHandlers(),super.destructor()}attachHandlers(){window.addEventListener("change",(e=>this.changeHandler(e))),window.addEventListener("click",(e=>this.clickHandler(e))),window.addEventListener("keydown",(e=>this.keyDownHandler(e))),window.addEventListener("submit",(e=>this.submitHandler(e)))}disableDefaultFormValidation(){document.querySelectorAll("form[data-request]:not([data-browser-validate])").forEach((e=>{e.setAttribute("novalidate",!0)}))}detachHandlers(){window.removeEventListener("change",(e=>this.changeHandler(e))),window.removeEventListener("click",(e=>this.clickHandler(e))),window.removeEventListener("keydown",(e=>this.keyDownHandler(e))),window.removeEventListener("submit",(e=>this.submitHandler(e)))}changeHandler(e){e.target.matches("select[data-request], input[type=radio][data-request], input[type=checkbox][data-request], input[type=file][data-request]")&&this.processRequestOnElement(e.target)}clickHandler(e){let t=e.target;for(;"HTML"!==t.tagName;){if(t.matches("a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]")){e.preventDefault(),this.processRequestOnElement(t);break}t=t.parentElement}}keyDownHandler(e){if(!e.target.matches("input"))return;-1!==["checkbox","color","date","datetime","datetime-local","email","image","month","number","password","radio","range","search","tel","text","time","url","week"].indexOf(e.target.getAttribute("type"))&&("Enter"===e.key&&e.target.matches("*[data-request]")?(this.processRequestOnElement(e.target),e.preventDefault(),e.stopImmediatePropagation()):e.target.matches("*[data-track-input]")&&this.trackInput(e.target))}submitHandler(e){e.target.matches("form[data-request]")&&(e.preventDefault(),this.processRequestOnElement(e.target))}processRequestOnElement(e){const t=e.dataset,a=String(t.request),r={confirm:"requestConfirm"in t?String(t.requestConfirm):null,redirect:"requestRedirect"in t?String(t.requestRedirect):null,loading:"requestLoading"in t?String(t.requestLoading):null,flash:"requestFlash"in t,files:"requestFiles"in t,browserValidate:"requestBrowserValidate"in t,form:"requestForm"in t?String(t.requestForm):null,url:"requestUrl"in t?String(t.requestUrl):null,update:"requestUpdate"in t?this.parseData(String(t.requestUpdate)):[],data:"requestData"in t?this.parseData(String(t.requestData)):[]};this.winter.request(e,a,r)}onAjaxSetup(e){let t=e.element.getAttribute("name");const a=Object.assign({},this.getParentRequestData(e.element),e.options.data);e.element&&e.element.matches("input, textarea, select, button")&&!e.form&&t&&!e.options.data[t]&&(a[t]=e.element.value),e.options.data=a}getParentRequestData(e){const t=[];let a={},r=e;for(;r.parentElement&&"HTML"!==r.parentElement.tagName;)t.push(r.parentElement),r=r.parentElement;return t.reverse(),t.forEach((e=>{const t=e.dataset;"requestData"in t&&(a=Object.assign({},a,this.parseData(t.requestData)))})),a}parseData(e){let t;if(void 0===e&&(t=""),"object"==typeof t)return t;try{return this.winter.jsonparser().parse("{"+e+"}")}catch(e){throw new Error("Error parsing the data attribute on element: "+e.message)}}trackInput(e){const t=e.dataset.lastValue,a=e.dataset.trackInput||300;void 0!==t&&t===e.value||(this.resetTrackInputTimer(e),e.dataset.trackInput=window.setTimeout((()=>{if(e.dataset.request)return void this.processRequestOnElement(e);let t=e;for(;t.parentElement&&"HTML"!==t.parentElement.tagName;)if(t=t.parentElement,"FORM"===t.tagName&&t.dataset.request){this.processRequestOnElement(t);break}}),a))}resetTrackInputTimer(e){e.dataset.trackInput&&(window.clearTimeout(e.dataset.trackInput),e.dataset.trackInput=null)}}Snowboard.addPlugin("attributeRequest",e)}();