﻿using VaquinhaAnimal.Domain.Entities.Base;
using VaquinhaAnimal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VaquinhaAnimal.Domain.Entities
{
    public class Campanha : BaseEntity
    {
        [JsonPropertyName("data_criacao")]
        [Required]
        public DateTime DataCriacao { get; set; }                   

        [JsonPropertyName("data_inicio")]
        public DateTime? DataInicio { get; set; }

        [JsonPropertyName("duracao_dias")]
        public int DuracaoDias { get; set; }

        [JsonPropertyName("data_encerramento")]
        public DateTime? DataEncerramento { get; set; }

        [JsonPropertyName("titulo")]
        [Required]
        public string Titulo { get; set; }

        [JsonPropertyName("video_url")]
        public string VideoUrl { get; set; }

        [JsonPropertyName("descricao_curta")]
        [Required]
        public string DescricaoCurta { get; set; } // (200)

        [JsonPropertyName("descricao_longa")]
        [Required]
        public string DescricaoLonga { get; set; }// (MÍNIMO 500 MÁXIMO 5.000)

        [JsonPropertyName("valor_desejado")]
        [Required]
        public decimal ValorDesejado { get; set; } // MAIOR QUE ZERO

        [JsonPropertyName("total_arrecadado")]
        [Required]
        public decimal TotalArrecadado { get; set; } // MAIOR OU IGUAL A ZERO

        [JsonPropertyName("termos")]
        [Required]
        public bool Termos { get; set; }

        [JsonPropertyName("premium")]
        [Required]
        public bool Premium { get; set; }

        [JsonPropertyName("status_campanha")]
        [Required]
        public StatusCampanhaEnum StatusCampanha { get; set; }

        [JsonPropertyName("usuario_id")]
        [Required]
        public Guid Usuario_Id { get; set; }

        [JsonPropertyName("redes_sociais")]
        public List<RedeSocial> RedesSociais { get; set; }

        [JsonPropertyName("imagens")]
        public List<Imagem> Imagens { get; set; }

        [JsonPropertyName("conta_deposito")]
        public ContaDeposito ContaDeposito { get; set; }

        [JsonPropertyName("beneficiario")]
        public Beneficiario Beneficiario { get; set; }

        [JsonPropertyName("doacoes")]
        public List<Doacao> Doacoes { get; set; } 
    }
}
