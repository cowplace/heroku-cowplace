;a
;;recursive
(define (accumulate combiner null-value term a next b)
  (if (> a b)
      null-value
      (combiner (term a)
		(accumulate combiner null-value term (next a) next b))))

;b
;;iterative
(define (accumulate2 combiner null-value term a next b)
  (define (accumulate-iter a result)
    (if (> a b)
        result
        (accumulate-iter (next a) (combiner (term a) result))))
  (accumulate-iter a null-value))