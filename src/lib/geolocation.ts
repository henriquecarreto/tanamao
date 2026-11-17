/**
 * Serviço de Geolocalização Nacional (Brasil)
 * Suporte a GPS (navigator.geolocation), BrasilAPI v2 (CEP) e IBGE (Estados e Municípios)
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ClientLocation {
  street?: string;
  neighborhood?: string;
  city: string;
  state: string; // Ex: 'SP'
  cep?: string;
  latitude: number;
  longitude: number;
  source: 'gps' | 'cep' | 'ibge' | 'default';
}

export type ProximityTier = 1 | 2 | 3 | 4;

export interface ProximityInfo {
  tier: ProximityTier;
  distanceKm: number;
  badgeLabel: string;
  badgeColor: string;
}

// Localização Padrão de Inicialização (Palmital - SP Centro)
export const DEFAULT_LOCATION: ClientLocation = {
  street: 'Rua Manoel Leão Rego',
  neighborhood: 'Centro',
  city: 'Palmital',
  state: 'SP',
  cep: '19970-000',
  latitude: -22.7936,
  longitude: -50.2153,
  source: 'default',
};

/**
 * Cálculo de distância em quilômetros via Fórmula de Haversine
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(1));
}

/**
 * Classificação obrigatória em cascata:
 * 1º Nível (Tier 1): Mesma Rua/Bairro ou até 2 km -> "No seu bairro • a X,X km de você"
 * 2º Nível (Tier 2): Mesma Cidade ou até 15 km -> "Na sua cidade • a X,X km"
 * 3º Nível (Tier 3): Regional (acima de 15 km e dentro do service_radius_km) -> "Atende sua região • [Cidade/UF] (a XX km)"
 * 4º Nível: Fora do raio de atendimento
 */
export function getProximityInfo(
  client: ClientLocation,
  provider: {
    neighborhood: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    serviceRadiusKm: number;
  }
): ProximityInfo {
  const dist = calculateDistanceKm(
    client.latitude,
    client.longitude,
    provider.latitude,
    provider.longitude
  );

  const isSameNeighborhood =
    Boolean(client.neighborhood) &&
    Boolean(provider.neighborhood) &&
    client.neighborhood?.trim().toLowerCase() === provider.neighborhood.trim().toLowerCase();

  const isSameCity =
    client.city.trim().toLowerCase() === provider.city.trim().toLowerCase() &&
    client.state.trim().toUpperCase() === provider.state.trim().toUpperCase();

  // Tier 1: Rua/Bairro ou dist <= 2km
  if (isSameNeighborhood || dist <= 2.0) {
    return {
      tier: 1,
      distanceKm: dist,
      badgeLabel: `No seu bairro • a ${dist.toFixed(1).replace('.', ',')} km de você`,
      badgeColor: 'bg-emerald-500 text-slate-950 font-black',
    };
  }

  // Tier 2: Mesma Cidade ou dist <= 15km
  if (isSameCity || dist <= 15.0) {
    return {
      tier: 2,
      distanceKm: dist,
      badgeLabel: `Na sua cidade • a ${dist.toFixed(1).replace('.', ',')} km`,
      badgeColor: 'bg-blue-600 text-white font-bold',
    };
  }

  // Tier 3: Regional (dentro do raio do prestador)
  const maxRadius = Math.max(provider.serviceRadiusKm || 35, 35);
  if (dist <= maxRadius) {
    return {
      tier: 3,
      distanceKm: dist,
      badgeLabel: `Atende sua região • ${provider.city}/${provider.state} (a ${Math.round(dist)} km)`,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    };
  }

  // Tier 4: Fora do raio
  return {
    tier: 4,
    distanceKm: dist,
    badgeLabel: `Fora da área (${Math.round(dist)} km)`,
    badgeColor: 'bg-slate-400 text-slate-950',
  };
}

/**
 * Consulta CEP na BrasilAPI v2 com coordenadas geográficas exatas
 */
export async function fetchCepBrasilApi(cep: string): Promise<ClientLocation | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
    if (res.ok) {
      const data = await res.json();
      const lat = data.location?.coordinates?.latitude
        ? parseFloat(data.location.coordinates.latitude)
        : null;
      const lng = data.location?.coordinates?.longitude
        ? parseFloat(data.location.coordinates.longitude)
        : null;

      return {
        street: data.street || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        state: (data.state || 'SP').toUpperCase(),
        cep: `${clean.slice(0, 5)}-${clean.slice(5)}`,
        latitude: lat || DEFAULT_LOCATION.latitude,
        longitude: lng || DEFAULT_LOCATION.longitude,
        source: 'cep',
      };
    }
  } catch (err) {
    console.warn('Erro ao consultar BrasilAPI:', err);
  }

  // Fallback para ViaCEP
  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (res.ok) {
      const data = await res.json();
      if (!data.erro) {
        return {
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: (data.uf || 'SP').toUpperCase(),
          cep: data.cep || clean,
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          source: 'cep',
        };
      }
    }
  } catch (err) {
    console.warn('Erro no fallback ViaCEP:', err);
  }

  return null;
}

/**
 * Busca lista oficial de Estados do Brasil via API do IBGE
 */
export async function fetchIbgeStates(): Promise<Array<{ id: number; sigla: string; nome: string }>> {
  try {
    const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Erro ao consultar estados do IBGE:', err);
  }
  return [
    { id: 35, sigla: 'SP', nome: 'São Paulo' },
    { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
    { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
    { id: 41, sigla: 'PR', nome: 'Paraná' },
  ];
}

/**
 * Busca lista oficial de Municípios por Estado via API do IBGE
 */
export async function fetchIbgeCitiesByState(uf: string): Promise<Array<{ id: number; nome: string }>> {
  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.toUpperCase()}/municipios?orderBy=nome`
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Erro ao consultar municípios de ${uf} do IBGE:`, err);
  }
  return [
    { id: 3535308, nome: 'Palmital' },
    { id: 3504008, nome: 'Assis' },
    { id: 3553954, nome: 'Tarumã' },
    { id: 3510005, nome: 'Cândido Mota' },
  ];
}

/**
 * Captura coordenadas do GPS do navegador e executa Reverse Geocoding
 */
export async function getCurrentGpsLocation(): Promise<ClientLocation | null> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Tenta Reverse Geocoding com OpenStreetMap
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'TaNaMao-Geolocator/2.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city =
              addr.city || addr.town || addr.municipality || addr.village || 'Sua Cidade';
            const state = (addr['ISO3166-2-lvl4']?.replace('BR-', '') || addr.state || 'SP').toUpperCase();

            resolve({
              street: addr.road || '',
              neighborhood: addr.suburb || addr.neighbourhood || addr.city_district || 'Seu Bairro',
              city,
              state: state.slice(0, 2),
              latitude: lat,
              longitude: lng,
              source: 'gps',
            });
            return;
          }
        } catch {
          // fallback sem reverse geocoding
        }

        resolve({
          street: 'Localização GPS',
          neighborhood: 'Bairro Detectado',
          city: 'Palmital',
          state: 'SP',
          latitude: lat,
          longitude: lng,
          source: 'gps',
        });
      },
      () => {
        resolve(null);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  });
}
