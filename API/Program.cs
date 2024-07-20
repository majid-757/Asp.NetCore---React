var builder = WebApplication.CreateBuilder(args);

// add services
 builder.Services.AddIdentityCore<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
            }

            )
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<StoreContext>();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:TokenKey"]))
                };
            });
            builder.Services.AddAuthorization();
            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<ICourseRepository, CourseRepository>();
            builder.Services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>)));
            builder.Services.AddAutoMapper(typeof(MappingProfiles));
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddControllers();
             builder.Services.AddDbContext<StoreContext>(x =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string dbConnection;

                if (env == "Development")
                {
                    // Reading value from appsettings.Development.json
                    dbConnection = (builder.Configuration.GetConnectionString("DefaultConnection"));
                }
                else
                {
                    // Reading Value from Heroku Environment variables.
                    var connectionUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // extracting values from the connectionURL
                    connectionUrl = connectionUrl.Replace("postgres://", string.Empty);
                    var pgUserPass = connectionUrl.Split("@")[0];
                    var pgHostPortDb = connectionUrl.Split("@")[1];
                    var pgHostPort = pgHostPortDb.Split("/")[0];
                    var pgDb = pgHostPortDb.Split("/")[1];
                    var pgUser = pgUserPass.Split(":")[0];
                    var pgPass = pgUserPass.Split(":")[1];
                    var pgHost = pgHostPort.Split(":")[0];
                    var pgPort = pgHostPort.Split(":")[1];

                    dbConnection = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;Trust Server Certificate=true";
                }

                // Using dbConnection string either from Development or production
                x.UseNpgsql(dbConnection);
            });

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
             builder.Services.AddCors(opt =>
           {
               opt.AddPolicy("CorsPolicy", policy =>
               {
                   policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
                   .WithOrigins("http://localhost:3000");
               });
           });
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });

            // http request pipeline

             var app = builder.Build();

             app.UseMiddleware<ExceptionMiddleware>();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

           app.UseStatusCodePagesWithReExecute("/redirect/{0}");

            // app.UseHttpsRedirection();

            app.UseRouting();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapFallbackToController("Index", "Fallback");

          using var scope = app.Services.CreateScope();
          var services = scope.ServiceProvider;

        var logger = services.GetRequiredService<ILogger<Program>>();
            try {
                 var userManager = services.GetRequiredService<UserManager<User>>();
                var context = services.GetRequiredService<StoreContext>();
               await context.Database.MigrateAsync();
               await StoreContextSeed.SeedAsync(context, logger, userManager);

            } catch(Exception ex)
            {
                logger.LogError(ex, "Somethin wrong happened during migration");

            }

          await app.RunAsync();