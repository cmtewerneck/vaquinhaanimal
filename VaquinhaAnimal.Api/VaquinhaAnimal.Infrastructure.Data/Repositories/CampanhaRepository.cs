﻿using VaquinhaAnimal.Domain.Interfaces;
using VaquinhaAnimal.Domain.Entities;
using VaquinhaAnimal.Data.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using VaquinhaAnimal.Data.Repositories;
using System.Linq;
using System.Collections.Generic;
using VaquinhaAnimal.Domain.Helpers;

namespace VaquinhaAnimal.Data.Repository
{
    public class CampanhaRepository : Repository<Campanha>, ICampanhaRepository
    {
        public CampanhaRepository(VaquinhaDbContext context) : base(context) { }
       
        public async Task<Campanha> GetByIdWithImagesAsync(Guid id)
        {
            return await Db.Campanhas
                .AsNoTracking()
                .Include(c => c.Imagens)
                .Include(c => c.Beneficiario)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        
        public async Task<Campanha> GetByIdWithImagesAndDonationsAsync(Guid id)
        {
            return await Db.Campanhas
                .AsNoTracking()
                .Include(c => c.Imagens)
                .Include(c => c.Doacoes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        
        public async Task<List<Campanha>> GetAllMyCampaignsAsync(Guid id)
        {
            return await Db.Campanhas
                .AsNoTracking()
                .Where(c => c.Usuario_Id == id)
                .Include(c => c.Doacoes)
                .Include(c => c.Imagens)
                .Include(c => c.RedesSociais)
                .Include(c => c.ContaDeposito)
                .OrderBy(p => p.DataCriacao)
                .ToListAsync();
        }
        
        public async Task<List<Campanha>> GetAllCampaignsAndImagesAsync(string email)
        {
            if (email == "contato@doadoresespeciais.com.br")
            {
                return await Db.Campanhas
                                .AsNoTracking()
                                .Include(c => c.Imagens)
                                .OrderBy(p => p.DataCriacao)
                                .ToListAsync();
            } 
            else
            {
                return await Db.Campanhas
                .AsNoTracking()
                .Include(c => c.Imagens)
                .Where(c => c.StatusCampanha == Domain.Enums.StatusCampanhaEnum.ANDAMENTO)
                .OrderBy(p => p.DataCriacao)
                .ToListAsync();
            }
            
        }

        // TESTE DE PAGINAÇÃO
        public async Task<PagedResult<Campanha>> ListAsync(int _PageSize, int _PageNumber)
        {
            var totalResults = Db.Campanhas
                .AsNoTracking()
                .Where(c => c.StatusCampanha == Domain.Enums.StatusCampanhaEnum.ANDAMENTO)
                .Count();

            var result = await Db.Campanhas
                .AsNoTracking()
                .Include(c => c.Imagens)
                .Where(c => c.StatusCampanha == Domain.Enums.StatusCampanhaEnum.ANDAMENTO)
                .Skip((_PageNumber - 1) * _PageSize)
                .Take(_PageSize)
                .OrderBy(p => p.DataCriacao)
                .ToListAsync();

            var resultPaginado = new PagedResult<Campanha>{ 
                PageNumber = _PageNumber,
                PageSize = _PageSize,
                TotalRecords = totalResults,
                Data = result
            };

            return resultPaginado;
        }
    }
}
