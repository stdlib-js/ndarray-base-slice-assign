"use strict";var q=function(a,r){return function(){return r||a((r={exports:{}}).exports,r),r.exports}};var n=q(function(R,v){
var l=require('@stdlib/ndarray-base-assert-is-safe-data-type-cast/dist'),y=require('@stdlib/ndarray-base-assert-is-same-kind-data-type-cast/dist'),c=require('@stdlib/ndarray-base-assert-is-floating-point-data-type/dist'),d=require('@stdlib/ndarray-base-assert-is-complex-floating-point-data-type/dist'),f=require('@stdlib/ndarray-base-assert-is-real-data-type/dist'),m=require('@stdlib/ndarray-base-broadcast-array/dist'),C=require('@stdlib/ndarray-base-unary/dist'),u=require('@stdlib/utils-identity-function/dist'),D=require('@stdlib/complex-base-cast-return/dist'),T=require('@stdlib/complex-ctors/dist'),g=require('@stdlib/ndarray-base-slice/dist'),h=require('@stdlib/error-tools-fmtprodmsg/dist');function w(a,r,o,p){var s,i,t,e;if(t=a.dtype,e=r.dtype,l(t,e))f(t)&&d(e)?i=D(u,1,T(e)):i=u;else if(c(e)&&y(t,e))i=u;else throw new TypeError(h("invalid argument. Input array values cannot be safely cast to the output array data type. Data types: [%s, %s].",t,e));return s=g(r,o,p,!0),a=m(a,s.shape),C([a,s],i),r}v.exports=w
});var b=n();module.exports=b;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
