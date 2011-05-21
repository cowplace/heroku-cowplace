;a
;;recursive
(define (product term a next b)
  (if (> a b)
      1
      (* (term a) (product term (next a) next b))))

(define (fact n)
  (define (inc x) (+ x 1))
  (define (ident x) x)
  (product ident 1 inc n))

;b
;;iterative
(define (pro term a next b)
  (define (iter a result)
    (if (> a b)
	result
	(iter (next a) (* result (term a)))))
  (iter a 1))