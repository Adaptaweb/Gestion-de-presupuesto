-- El selector del modal de edicion guardaba 'Debito'/'Credito' sin tilde, mientras
-- los parsers y el ingreso manual guardan 'Debito'/'Credito' con tilde. Como el
-- resumen agrupa por el texto crudo (GROUP BY banco, tipo_tarjeta), un mismo banco
-- aparecia con dos lineas de credito que en la tarjeta se leen identicas.
UPDATE transacciones_extraidas SET tipo_tarjeta = 'Crédito'
 WHERE lower(tipo_tarjeta) IN ('credito', 'crédito');

UPDATE transacciones_extraidas SET tipo_tarjeta = 'Débito'
 WHERE lower(tipo_tarjeta) IN ('debito', 'débito');
