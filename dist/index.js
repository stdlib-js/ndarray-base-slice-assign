"use strict";var p=function(e,r){return function(){try{return r||e((r={exports:{}}).exports,r),r.exports}catch(a){throw (r=0, a)}};};var n=p(function(w,v){
var c=require('@stdlib/ndarray-base-assert-is-mostly-safe-data-type-cast/dist'),q=require('@stdlib/ndarray-base-broadcast-array/dist'),y=require('@stdlib/ndarray-base-assign/dist'),l=require('@stdlib/ndarray-base-slice/dist'),u=require('@stdlib/ndarray-base-dtype/dist'),d=require('@stdlib/ndarray-base-shape/dist'),f=require('@stdlib/error-tools-fmtprodmsg/dist');function g(e,r,a,o){var t,s,i;if(s=u(e),i=u(r),!c(s,i))throw new TypeError(f('1jPF0',s,i));return t=l(r,a,o,!0),e=q(e,d(t,!0)),y([e,t]),r}v.exports=g
});var h=n();module.exports=h;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
