; fib(n+2) = fib(n+1) + fib(n)
; x^2 = x + 1
; x = p,q
; => fib(n+2) - p*fib(n+1) = q*(fib(n+1) - p*fib(n)) = (q^n+2)*1 ... 1
;    fib(n+2) - q*fib(n+1) = p*(fib(n+1) - q*fib(n)) = (p^n+2)*1 ... 2
; => fib(n) = (p^n + q^n)/sqrt(5)
; => 0<q<1 => q^n -> 0 (n->infinate) 
; => ...