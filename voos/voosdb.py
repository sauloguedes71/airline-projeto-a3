import pandas as pd
import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_batch
import os
from datetime import datetime
import configparser

def criar_configuracao_postgres():
    config = configparser.ConfigParser()
    config['POSTGRESQL'] = {
        'host': 'localhost',
        'port': '5432',
        'database': 'voos',
        'user': 'postgres',
        'password': 'postgres'
    }
    
    with open('config_postgres.ini', 'w') as configfile:
        config.write(configfile)
    print("Arquivo config_postgres.ini criado. Configure suas credenciais do PostgreSQL.")

def carregar_configuracao_postgres():
    config = configparser.ConfigParser()
    config.read('config_postgres.ini')
    return config['POSTGRESQL']

def testar_conexao_postgres():
    try:
        config = carregar_configuracao_postgres()
        conexao = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database=config['database'],
            user=config['user'],
            password=config['password']
        )
        print("Conexão com PostgreSQL estabelecida com sucesso!")
        return conexao
    except Exception as e:
        print(f"❌ Erro na conexão PostgreSQL: {e}")
        return None

def criar_tabela_voos_postgres():
    try:
        config = carregar_configuracao_postgres()
        conexao = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database=config['database'],
            user=config['user'],
            password=config['password']
        )
        cursor = conexao.cursor()
        
        print("🗃️ Criando tabela de voos no PostgreSQL...")
        
        # Criar tabela de voos com estrutura otimizada para PostgreSQL
        create_table_query = """
        CREATE TABLE IF NOT EXISTS voos (
            id SERIAL PRIMARY KEY,
            id_voo_original INTEGER,
            data_partida DATE,
            origem VARCHAR(3),
            destino VARCHAR(3),
            duracao_horas NUMERIC(4,1),
            preco_economica NUMERIC(10,2),
            preco_executiva NUMERIC(10,2),
            preco_premium NUMERIC(10,2),
            temporada VARCHAR(20),
            antecedencia_dias INTEGER,
            lotacao_media NUMERIC(5,2),
            companhia VARCHAR(50),
            tipo_tarifa VARCHAR(20),
            tipo_voo VARCHAR(20),
            classe_aviao VARCHAR(20),
            tipo_rota VARCHAR(20),
            tamanho_aviao VARCHAR(20),
            ano INTEGER,
            mes INTEGER,
            dia_semana INTEGER,
            markup_executiva NUMERIC(5,2),
            markup_premium NUMERIC(5,2),
            categoria_preco VARCHAR(20),
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Criar índices para otimização
        CREATE INDEX IF NOT EXISTS idx_voos_data_partida ON voos(data_partida);
        CREATE INDEX IF NOT EXISTS idx_voos_origem_destino ON voos(origem, destino);
        CREATE INDEX IF NOT EXISTS idx_voos_companhia ON voos(companhia);
        CREATE INDEX IF NOT EXISTS idx_voos_ano_mes ON voos(ano, mes);
        CREATE INDEX IF NOT EXISTS idx_voos_temporada ON voos(temporada);
        """
        
        cursor.execute(create_table_query)
        conexao.commit()
        
        print("✅ Tabela 'voos' criada com sucesso no PostgreSQL!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar tabela: {e}")
        return False
    finally:
        if conexao:
            cursor.close()
            conexao.close()

def carregar_dados_voos():
    """Carrega e unifica os dados de voos dos arquivos CSV"""
    print("📊 Carregando dados dos arquivos CSV...")
    
    arquivos = [
        'datasets_voos/voos_aerobrasil_2019_2024.csv',
        'datasets_voos/voos_skyfast_2019_2024.csv', 
        'datasets_voos/voos_globalwings_2019_2024.csv',
        'datasets_voos/voos_airregional_2019_2024.csv'
    ]
    
    # Verificar se arquivos existem
    for arquivo in arquivos:
        if not os.path.exists(arquivo):
            print(f"❌ Arquivo {arquivo} não encontrado!")
            return None
    
    # Ler e combinar datasets
    dataframes = []
    for arquivo in arquivos:
        try:
            df = pd.read_csv(arquivo)
            dataframes.append(df)
            print(f"✅ {arquivo}: {len(df)} registros")
        except Exception as e:
            print(f"❌ Erro ao ler {arquivo}: {e}")
            return None
    
    # Unificar dados
    df_unificado = pd.concat(dataframes, ignore_index=True)
    df_unificado = preparar_dados_postgres(df_unificado)
    
    print(f"🎯 Dataset unificado: {len(df_unificado)} registros")
    return df_unificado

def preparar_dados_postgres(df):
    """Prepara os dados para inserção no PostgreSQL"""
    
    # Preencher valores nulos
    df['Preco_Premium'] = df['Preco_Premium'].fillna(0)
    df['Preco_Executiva'] = df['Preco_Executiva'].fillna(0)
    
    # Converter Lotacao_Media para numérico
    df['Lotacao_Media'] = df['Lotacao_Media'].astype(str).str.replace('%', '').astype(float)
    
    # Adicionar colunas calculadas
    df['Data_Partida'] = pd.to_datetime(df['Data_Partida'])
    df['Ano'] = df['Data_Partida'].dt.year
    df['Mes'] = df['Data_Partida'].dt.month
    df['Dia_Semana'] = df['Data_Partida'].dt.dayofweek
    
    # Calcular markups
    df['Markup_Executiva'] = (df['Preco_Executiva'] / df['Preco_Economica']).round(2)
    df['Markup_Premium'] = (df['Preco_Premium'] / df['Preco_Economica']).round(2)
    
    # Categorizar preços
    def categorizar_preco(preco):
        if preco <= 300: return 'Baixo'
        elif preco <= 600: return 'Médio'
        elif preco <= 1000: return 'Alto'
        else: return 'Muito Alto'
    
    df['Categoria_Preco'] = df['Preco_Economica'].apply(categorizar_preco)
    
    # Preencher valores nulos em colunas opcionais
    colunas_opcionais = ['Tipo_Tarifa', 'Tipo_Voo', 'Classe_Aviao', 'Tipo_Rota', 'Tamanho_Aviao']
    for coluna in colunas_opcionais:
        if coluna in df.columns:
            df[coluna] = df[coluna].fillna('Não Informado')
        else:
            df[coluna] = 'Não Informado'
    
    return df

def inserir_dados_postgres(df):
    """Insere dados na tabela de voos do PostgreSQL"""
    try:
        config = carregar_configuracao_postgres()
        conexao = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database=config['database'],
            user=config['user'],
            password=config['password']
        )
        cursor = conexao.cursor()
        
        print("📥 Iniciando inserção de dados no PostgreSQL...")
        
        # Query de inserção
        insert_query = """
        INSERT INTO voos (
            id_voo_original, data_partida, origem, destino, duracao_horas,
            preco_economica, preco_executiva, preco_premium, temporada,
            antecedencia_dias, lotacao_media, companhia, tipo_tarifa,
            tipo_voo, classe_aviao, tipo_rota, tamanho_aviao, ano, mes,
            dia_semana, markup_executiva, markup_premium, categoria_preco
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        # Preparar dados para inserção
        dados_voos = []
        for _, row in df.iterrows():
            dados_voos.append((
                row.get('ID_Voo', 0),
                row['Data_Partida'].date() if hasattr(row['Data_Partida'], 'date') else row['Data_Partida'],
                row['Origem'],
                row['Destino'],
                float(row['Duracao_Horas']),
                float(row['Preco_Economica']),
                float(row.get('Preco_Executiva', 0)),
                float(row.get('Preco_Premium', 0)),
                row['Temporada'],
                int(row['Antecedencia_Dias']),
                float(row['Lotacao_Media']),
                row['Companhia'],
                row.get('Tipo_Tarifa', 'Não Informado'),
                row.get('Tipo_Voo', 'Não Informado'),
                row.get('Classe_Aviao', 'Não Informado'),
                row.get('Tipo_Rota', 'Não Informado'),
                row.get('Tamanho_Aviao', 'Não Informado'),
                int(row.get('Ano', 0)),
                int(row.get('Mes', 0)),
                int(row.get('Dia_Semana', 0)),
                float(row.get('Markup_Executiva', 0)),
                float(row.get('Markup_Premium', 0)),
                row.get('Categoria_Preco', 'Não Informado')
            ))
        
        # Inserir em lotes usando execute_batch para melhor performance
        lote_size = 1000
        total_registros = len(dados_voos)
        
        print(f"🔄 Inserindo {total_registros} registros em lotes de {lote_size}...")
        
        for i in range(0, total_registros, lote_size):
            lote = dados_voos[i:i + lote_size]
            execute_batch(cursor, insert_query, lote, page_size=lote_size)
            conexao.commit()
            progresso = min(i + lote_size, total_registros)
            print(f"✅ Lote {i//lote_size + 1}: {progresso}/{total_registros} registros inseridos")
        
        # Verificar inserção
        cursor.execute("SELECT COUNT(*) FROM voos")
        total_inserido = cursor.fetchone()[0]
        
        print(f"🎯 Total de registros inseridos na tabela 'voos': {total_inserido}")
        
        # Criar estatísticas para o otimizador de queries
        cursor.execute("ANALYZE voos;")
        conexao.commit()
        print("📊 Estatísticas da tabela atualizadas (ANALYZE)")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao inserir dados: {e}")
        if conexao:
            conexao.rollback()
        return False
    finally:
        if conexao:
            cursor.close()
            conexao.close()

def verificar_dados_postgres():
    """Verifica os dados inseridos no PostgreSQL"""
    try:
        config = carregar_configuracao_postgres()
        conexao = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database=config['database'],
            user=config['user'],
            password=config['password']
        )
        
        print("\n🔍 VERIFICAÇÃO DOS DADOS NO POSTGRESQL")
        print("=" * 50)
        
        # Consultas de verificação
        consultas = [
            ("Total de registros", "SELECT COUNT(*) as total_voos FROM voos"),
            ("Voos por companhia", """
             SELECT companhia, COUNT(*) as total_voos 
             FROM voos 
             GROUP BY companhia 
             ORDER BY total_voos DESC
             """),
            ("Preço médio por companhia", """
             SELECT companhia, 
                    ROUND(AVG(preco_economica), 2) as preco_medio_economica,
                    ROUND(AVG(preco_executiva), 2) as preco_medio_executiva,
                    ROUND(AVG(lotacao_media), 2) as ocupacao_media
             FROM voos 
             GROUP BY companhia 
             ORDER BY preco_medio_economica
             """),
            ("Distribuição por ano", """
             SELECT ano, COUNT(*) as total_voos 
             FROM voos 
             GROUP BY ano 
             ORDER BY ano
             """)
        ]
        
        for descricao, query in consultas:
            print(f"\n{descricao}:")
            df = pd.read_sql_query(query, conexao)
            print(df.to_string(index=False))
        
        # Estatísticas da tabela
        print(f"\n📈 ESTATÍSTICAS DA TABELA:")
        stats_query = """
        SELECT 
            schemaname,
            tablename,
            attname as coluna,
            n_distinct,
            correlation
        FROM pg_stats 
        WHERE tablename = 'voos' 
        ORDER BY attname
        """
        df_stats = pd.read_sql_query(stats_query, conexao)
        if not df_stats.empty:
            print(df_stats.to_string(index=False))
        
        conexao.close()
        
    except Exception as e:
        print(f"❌ Erro na verificação: {e}")

def gerar_script_backup():
    """Gera script SQL de backup da tabela"""
    backup_script = f"""
-- Script de Backup PostgreSQL - Tabela Voos
-- Gerado em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

-- 1. Backup da estrutura da tabela
\\d voos

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
"""
    
    with open('backup_voos_postgresql.sql', 'w') as f:
        f.write(backup_script)
    
    print("💾 Script de backup gerado: backup_voos_postgresql.sql")

def main():
    """Função principal"""
    print("🚀 POPULAÇÃO DA TABELA VOOS - POSTGRESQL")
    print("=" * 60)
    
    # Verificar se config existe
    if not os.path.exists('config_postgres.ini'):
        criar_configuracao_postgres()
        print("⚠️  Configure o arquivo config_postgres.ini com suas credenciais do PostgreSQL")
        return
    
    # Testar conexão
    conexao = testar_conexao_postgres()
    if not conexao:
        return
    conexao.close()
    
    # Criar tabela
    if not criar_tabela_voos_postgres():
        return
    
    # Carregar dados
    df_voos = carregar_dados_voos()
    if df_voos is None:
        return
    
    # Inserir dados
    if inserir_dados_postgres(df_voos):
        # Verificar dados
        verificar_dados_postgres()
        
        # Gerar script de backup
        gerar_script_backup()
        
        print("\n" + "=" * 60)
        print("✅ POPULAÇÃO POSTGRESQL CONCLUÍDA COM SUCESSO!")
        print(f"📊 Total de registros processados: {len(df_voos)}")
        print("\n🗃️ Tabela 'voos' criada com índices otimizados")
        print("📈 Estatísticas atualizadas para o otimizador de queries")
        
    else:
        print("❌ Erro na inserção dos dados.")

if __name__ == "__main__":
    main()
