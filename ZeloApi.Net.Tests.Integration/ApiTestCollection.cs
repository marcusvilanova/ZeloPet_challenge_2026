using Xunit;

namespace ZeloApi.Net.Tests.Integration
{
    [CollectionDefinition(Name)]
    public class ApiTestCollection : ICollectionFixture<CustomWebApplicationFactory>
    {
        public const string Name = "Zelo API Collection";
    }
}
