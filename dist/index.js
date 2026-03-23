"use strict";var p=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var v=p(function(w,u){
var c=require('@stdlib/ndarray-base-assert-is-mostly-safe-data-type-cast/dist'),q=require('@stdlib/ndarray-base-broadcast-array/dist'),y=require('@stdlib/ndarray-base-assign/dist'),l=require('@stdlib/ndarray-base-slice/dist'),i=require('@stdlib/ndarray-base-dtype/dist'),d=require('@stdlib/ndarray-base-shape/dist'),f=require('@stdlib/error-tools-fmtprodmsg/dist');function g(e,r,n,o){var a,t,s;if(t=i(e),s=i(r),!c(t,s))throw new TypeError(f('1jPF0',t,s));return a=l(r,n,o,!0),e=q(e,d(a,!0)),y([e,a]),r}u.exports=g
});var h=v();module.exports=h;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
