package com.travelapp.config;

import com.travelapp.entity.Destination;
import com.travelapp.entity.Place;
import com.travelapp.repository.DestinationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class SeedDataConfig {

    @Bean
    public CommandLineRunner seedDatabase(DestinationRepository destinationRepository) {
        return args -> {
            if (destinationRepository.count() == 0) {
                
                // Asia
                Destination tokyo = createDestination("Tokyo", "Japan", "Asia", 
                        "Japan's busy capital, mixes the ultramodern and the traditional.", 
                        "Experience the vibrant culture, neon-lit streets, historic temples, and exquisite cuisine of Japan's bustling capital city.", 
                        "March to May and September to November", "Culture & City", 35.6762, 139.6503, 98);
                addPlaces(tokyo, 
                        "Shibuya Crossing", "Famous scramble intersection", "Shibuya",
                        "Senso-ji Temple", "Ancient Buddhist temple", "Asakusa",
                        "Tokyo Skytree", "Tallest tower in Japan", "Sumida",
                        "Meiji Shrine", "Shinto shrine dedicated to Emperor Meiji", "Shibuya",
                        "Tokyo Tower", "Eiffel Tower-inspired lattice tower", "Minato");

                Destination bali = createDestination("Bali", "Indonesia", "Asia", 
                        "An Indonesian island known for its forested volcanic mountains and beaches.", 
                        "Bali is a living postcard, an Indonesian paradise that feels like a fantasy. Soak up the sun on a stretch of fine white sand, or commune with the tropical creatures as you dive along coral ridges or the colorful wreck of a WWII war ship.", 
                        "April to October", "Beach & Nature", -8.4095, 115.1889, 95);
                addPlaces(bali, 
                        "Uluwatu Temple", "Sea temple perched on a cliff", "South Kuta",
                        "Ubud Monkey Forest", "Nature reserve and Hindu temple complex", "Ubud",
                        "Tegallalang Rice Terrace", "Beautiful terraced rice paddies", "Tegallalang",
                        "Mount Batur", "Active volcano for sunrise hikes", "Kintamani",
                        "Tanah Lot", "Iconic offshore temple", "Tabanan");

                Destination dubai = createDestination("Dubai", "United Arab Emirates", "Asia", 
                        "A city and emirate in the UAE known for luxury shopping and ultramodern architecture.", 
                        "Dubai is a city of superlatives, home to the world's tallest tower, one of the world's largest shopping malls, and one of the world's largest man-made marinas.", 
                        "November to March", "Luxury & City", 25.2048, 55.2708, 92);
                addPlaces(dubai, 
                        "Burj Khalifa", "World's tallest building", "Downtown Dubai",
                        "Dubai Mall", "Massive shopping and entertainment center", "Downtown Dubai",
                        "Palm Jumeirah", "Tree-shaped artificial archipelago", "Jumeirah",
                        "Dubai Marina", "Artificial canal city", "Dubai Marina",
                        "Museum of the Future", "Innovative technology museum", "Trade Centre");

                Destination singapore = createDestination("Singapore", "Singapore", "Asia", 
                        "An island city-state off southern Malaysia, known for its global financial center.", 
                        "Singapore is a melting pot of culture and history, and an extravaganza of culinary delights. It is a city of the future, with a stunning skyline and incredible botanical gardens.", 
                        "February to April", "City & Culture", 1.3521, 103.8198, 90);
                addPlaces(singapore, 
                        "Gardens by the Bay", "Futuristic nature park", "Marina Bay",
                        "Marina Bay Sands", "Iconic integrated resort", "Marina Bay",
                        "Sentosa Island", "Island resort with theme parks", "Sentosa",
                        "Singapore Zoo", "World-renowned open concept zoo", "Mandai",
                        "Merlion Park", "Landmark featuring the mythical Merlion", "Downtown Core");

                Destination bangkok = createDestination("Bangkok", "Thailand", "Asia", 
                        "Thailand's capital, known for ornate shrines and vibrant street life.", 
                        "Bangkok is a city of contrasts with action at every turn; marvel at the gleaming temples, catch a tuk tuk along the bustling Chinatown or take a longtail boat through floating markets.", 
                        "November to February", "Culture & Nightlife", 13.7563, 100.5018, 91);
                addPlaces(bangkok, 
                        "Grand Palace", "Former royal residence", "Phra Nakhon",
                        "Wat Arun", "Temple of Dawn on the Chao Phraya River", "Bangkok Yai",
                        "Chatuchak Weekend Market", "Massive market with thousands of stalls", "Chatuchak",
                        "Wat Pho", "Temple of the Reclining Buddha", "Phra Nakhon",
                        "Khaosan Road", "Famous backpacker street", "Phra Nakhon");

                // Europe
                Destination paris = createDestination("Paris", "France", "Europe", 
                        "The city of lights and love.", 
                        "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.", 
                        "April to June, October to early November", "Culture", 48.8566, 2.3522, 99);
                addPlaces(paris, 
                        "Eiffel Tower", "Iconic wrought-iron lattice tower", "7th arrondissement",
                        "Louvre Museum", "World's largest art museum", "1st arrondissement",
                        "Arc de Triomphe", "Monument honoring those who fought for France", "8th arrondissement",
                        "Montmartre", "Historic hill district with artistic heritage", "18th arrondissement",
                        "Notre-Dame", "Medieval Catholic cathedral", "4th arrondissement");

                Destination london = createDestination("London", "United Kingdom", "Europe", 
                        "Capital of England and the UK, a 21st-century city with history stretching back to Roman times.", 
                        "London is a layered city, with history spanning nearly 2,000 years. Discover world-class museums, magnificent historical landmarks, and a vibrant arts scene.", 
                        "May to August", "Culture & History", 51.5074, -0.1278, 96);
                addPlaces(london, 
                        "Tower of London", "Historic castle on the River Thames", "Tower Hamlets",
                        "British Museum", "Institution dedicated to human history", "Bloomsbury",
                        "London Eye", "Giant observation wheel", "South Bank",
                        "Buckingham Palace", "London residence of the UK sovereign", "Westminster",
                        "Big Ben", "Iconic clock tower", "Westminster");

                Destination rome = createDestination("Rome", "Italy", "Europe", 
                        "Italy's capital, a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art.", 
                        "Rome is the capital city and a special comune of Italy. It is a city rich in history, with ruins from the mighty Roman Empire scattered throughout its modern streets.", 
                        "April to June and September to October", "History & Culture", 41.9028, 12.4964, 97);
                addPlaces(rome, 
                        "Colosseum", "Ancient gladiatorial arena", "Centro Storico",
                        "Vatican Museums", "Vast collection of art and historical pieces", "Vatican City",
                        "Pantheon", "Former Roman temple, now a church", "Centro Storico",
                        "Trevi Fountain", "Famous Baroque fountain", "Trevi",
                        "Roman Forum", "Ruins of the ancient city center", "Campitelli");

                Destination barcelona = createDestination("Barcelona", "Spain", "Europe", 
                        "The cosmopolitan capital of Spain's Catalonia region, known for its art and architecture.", 
                        "Barcelona is an enchanting seaside city with boundless culture, fabled architecture, and a world-class drinking and dining scene.", 
                        "May to June, September to October", "Art & Beach", 41.3851, 2.1734, 94);
                addPlaces(barcelona, 
                        "Sagrada Familia", "Gaudi's iconic unfinished basilica", "Eixample",
                        "Park Güell", "Public park system composed of gardens and architectonic elements", "Gràcia",
                        "Casa Batlló", "Renowned building designed by Antoni Gaudí", "Eixample",
                        "La Rambla", "Famous tree-lined pedestrian street", "Ciutat Vella",
                        "Gothic Quarter", "Historic center of the old city", "Ciutat Vella");

                Destination amsterdam = createDestination("Amsterdam", "Netherlands", "Europe", 
                        "The Netherlands' capital, known for its artistic heritage and elaborate canal system.", 
                        "Amsterdam is a city of canals, bicycles, and historic charm. Explore its many museums, wander its narrow streets, and enjoy the relaxed atmosphere.", 
                        "April to May or September to November", "Culture & History", 52.3676, 4.9041, 93);
                addPlaces(amsterdam, 
                        "Rijksmuseum", "Dutch national museum dedicated to arts and history", "Museumplein",
                        "Anne Frank House", "Writer's house and biographical museum", "Jordaan",
                        "Van Gogh Museum", "Museum dedicated to the works of Vincent van Gogh", "Museumplein",
                        "Vondelpark", "Public urban park", "Amsterdam Oud-Zuid",
                        "Jordaan", "Charming neighborhood with narrow streets and canals", "City Centre");

                // North America
                Destination newYork = createDestination("New York", "USA", "North America", 
                        "The city that never sleeps.", 
                        "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that's among the world's major commercial, financial and cultural centers.", 
                        "April to June and September to early November", "City & Culture", 40.7128, -74.0060, 98);
                addPlaces(newYork, 
                        "Statue of Liberty", "Colossal copper statue on Liberty Island", "New York Harbor",
                        "Central Park", "Urban park in Manhattan", "Manhattan",
                        "Empire State Building", "Iconic Art Deco skyscraper", "Midtown Manhattan",
                        "Times Square", "Major commercial intersection and tourist destination", "Midtown Manhattan",
                        "Metropolitan Museum of Art", "Largest art museum in the Americas", "Upper East Side");

                Destination vancouver = createDestination("Vancouver", "Canada", "North America", 
                        "A bustling west coast seaport in British Columbia, is among Canada's densest, most ethnically diverse cities.", 
                        "A popular filming location, it's surrounded by mountains, and also has thriving art, theatre and music scenes.", 
                        "March to May and September to November", "Nature & City", 49.2827, -123.1207, 89);
                addPlaces(vancouver, 
                        "Stanley Park", "Large public park bordering downtown", "Downtown",
                        "Granville Island", "Peninsula and shopping district", "Fairview",
                        "Capilano Suspension Bridge", "Simple suspension bridge crossing the Capilano River", "North Vancouver",
                        "Science World", "Interactive science center", "False Creek",
                        "Vancouver Aquarium", "Public aquarium located in Stanley Park", "Stanley Park");

                // South America
                Destination rio = createDestination("Rio de Janeiro", "Brazil", "South America", 
                        "A huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches.", 
                        "Rio de Janeiro is known for its breathtaking landscape, its laid-back beach culture, and its annual Carnival.", 
                        "December to March", "Beach & Culture", -22.9068, -43.1729, 91);
                addPlaces(rio, 
                        "Christ the Redeemer", "Colossal Art Deco statue of Jesus Christ", "Mount Corcovado",
                        "Sugarloaf Mountain", "Peak situated at the mouth of Guanabara Bay", "Urca",
                        "Copacabana Beach", "World-famous beach", "Copacabana",
                        "Ipanema Beach", "Trendy beach known for its elegance", "Ipanema",
                        "Tijuca National Park", "Urban national park", "Tijuca");

                // Africa
                Destination capeTown = createDestination("Cape Town", "South Africa", "Africa", 
                        "A port city on South Africa's southwest coast, on a peninsula beneath the imposing Table Mountain.", 
                        "Cape Town is a vibrant, multicultural city with a rich history and stunning natural scenery, from its iconic mountain to its beautiful beaches.", 
                        "March to May and September to November", "Nature & Adventure", -33.9249, 18.4241, 92);
                addPlaces(capeTown, 
                        "Table Mountain", "Flat-topped mountain forming a prominent landmark", "Table Mountain National Park",
                        "Robben Island", "Island where Nelson Mandela was imprisoned", "Table Bay",
                        "V&A Waterfront", "Historic harbor with shopping and dining", "Foreshore",
                        "Kirstenbosch National Botanical Garden", "Important botanical garden", "Newlands",
                        "Cape of Good Hope", "Rocky headland on the Atlantic coast", "Cape Peninsula");

                // Australia
                Destination sydney = createDestination("Sydney", "Australia", "Australia", 
                        "Capital of New South Wales and one of Australia's largest cities.", 
                        "Sydney is best known for its harbourfront Sydney Opera House, with a distinctive sail-like design.", 
                        "September to November and March to May", "City & Beach", -33.8688, 151.2093, 94);
                addPlaces(sydney, 
                        "Sydney Opera House", "Multi-venue performing arts centre", "Sydney Harbour",
                        "Sydney Harbour Bridge", "Steel through arch bridge", "Sydney Harbour",
                        "Bondi Beach", "Popular beach and surrounding suburb", "Bondi",
                        "Taronga Zoo", "City zoo located on the shores of Sydney Harbour", "Mosman",
                        "Darling Harbour", "Harbour adjacent to the city centre", "Sydney CBD");

                destinationRepository.saveAll(Arrays.asList(
                        tokyo, bali, dubai, singapore, bangkok,
                        paris, london, rome, barcelona, amsterdam,
                        newYork, vancouver,
                        rio, capeTown, sydney
                ));
            }
        };
    }

    private Destination createDestination(String name, String country, String continent, String shortDesc, String desc, String bestTime, String category, Double lat, Double lng, Integer pop) {
        Destination d = new Destination();
        d.setName(name);
        d.setCountry(country);
        d.setContinent(continent);
        d.setShortDescription(shortDesc);
        d.setDescription(desc);
        d.setBestTimeToVisit(bestTime);
        d.setCategory(category);
        d.setLatitude(lat);
        d.setLongitude(lng);
        d.setPopularity(pop);
        return d;
    }

    private void addPlaces(Destination dest, String... placeData) {
        for (int i = 0; i < placeData.length; i += 3) {
            Place p = new Place();
            p.setName(placeData[i]);
            p.setDescription(placeData[i+1]);
            p.setLocation(placeData[i+2]);
            p.setCategory("Attraction");
            p.setRecommendedDuration("2-3 hours");
            p.setDestination(dest);
            dest.getPlaces().add(p);
        }
    }
}
