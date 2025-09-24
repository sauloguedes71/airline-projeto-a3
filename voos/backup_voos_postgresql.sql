
-- Script de Backup PostgreSQL - Tabela Voos
-- Gerado em: 2025-09-24 12:21:50

-- 1. Backup da estrutura da tabela
\d voos

-- 2. Consulta para exportar dados (copie e execute no psql)
COPY (
    SELECT 
        id_voo_original, data_partida, origem, destino, duracao_horas,
        preco_economica, preco_executiva, preco_premium, temporada,
        antecedencia_dias, lotacao_media, companhia, tipo_tarifa,
        tipo_voo, classe_aviao, tipo_rota, tamanho_aviao, ano, mes,
        dia_semana, markup_executiva, markup_premium, categoria_preco
    FROM voos
    ORDER BY data_partida, companhia
) TO STDOUT WITH CSV HEADER;

-- 3. Estatísticas da tabela
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename = 'voos';

-- 4. Tamanho da tabela e índices
SELECT 
    pg_size_pretty(pg_total_relation_size('voos')) as tamanho_total,
    pg_size_pretty(pg_relation_size('voos')) as tamanho_tabela,
    pg_size_pretty(pg_total_relation_size('voos') - pg_relation_size('voos')) as tamanho_indices;
