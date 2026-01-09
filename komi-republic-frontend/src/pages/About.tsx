import PageHeader from '../components/PageHeader';

export default function About() {
  return (
    <main className="main-content">
      <PageHeader 
        title="О городе"
        subtitle="Узнайте больше о столице Республики Коми - городе с богатой историей и уникальной культурой"
      />

      {/* История города */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title">История Сыктывкара</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--slate-700)' }}>
              Сыктывкар — столица Республики Коми, город с богатой историей, уходящей корнями в XVI век. 
              Основанный в 1586 году как село Усть-Сысольск, город расположен на берегу реки Сысолы при 
              впадении её в Вычегду.
            </p>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--slate-700)' }}>
              Название города происходит от коми-зырянских слов «сыктыв» (Сысола) и «кар» (город), 
              что буквально означает «город на Сысоле». В 1780 году Усть-Сысольск получил статус уездного 
              города, а в 1930 году был переименован в Сыктывкар и стал столицей Коми автономной области.
            </p>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--slate-700)' }}>
              Сегодня Сыктывкар — современный культурный, образовательный и экономический центр региона, 
              сохранивший свою самобытность и национальный колорит.
            </p>
          </div>
        </div>
      </section>

      {/* Культура и традиции */}
      <section className="section" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title">Культура и традиции</h2>
          </div>
          <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>language</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                    Коми язык
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                    Коми язык относится к финно-угорской языковой семье и является одним из государственных 
                    языков Республики Коми наряду с русским. В городе активно развивается коми культура, 
                    работают национальные театры и культурные центры.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>celebration</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                    Народные праздники
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                    В Сыктывкаре отмечают традиционные коми праздники, такие как Луд (праздник весны), 
                    День коми письменности и культуры. Эти мероприятия сопровождаются народными гуляниями, 
                    выступлениями фольклорных коллективов и ярмарками.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>palette</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                    Народные промыслы
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                    Коми народ славится своими ремёслами: резьбой по дереву, плетением из бересты, 
                    вышивкой и ткачеством. Изделия местных мастеров можно увидеть в музеях и приобрести 
                    на ярмарках народного творчества.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Интересные факты */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title">Интересные факты</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: '0.75rem',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                🌲 Северная столица
              </h4>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                Сыктывкар — самая северная столица республики в составе России, расположенная за Полярным кругом.
              </p>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: '0.75rem',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                📚 Город образования
              </h4>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                В городе работают несколько крупных вузов, включая Сыктывкарский государственный университет 
                имени Питирима Сорокина, что делает его важным образовательным центром региона.
              </p>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: '0.75rem',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                🎭 Культурная жизнь
              </h4>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                В Сыктывкаре работают три профессиональных театра, включая единственный в мире 
                профессиональный театр на коми языке — Национальный музыкально-драматический театр Республики Коми.
              </p>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: '0.75rem',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                🏞️ Природное богатство
              </h4>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                Город окружён живописными лесами и реками. Рядом находится национальный парк «Югыд ва» — 
                один из крупнейших в Европе, включённый в список Всемирного наследия ЮНЕСКО.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Климат */}
      <section className="section" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title">Климат</h2>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--slate-700)', marginBottom: '1.5rem' }}>
              Сыктывкар расположен в зоне умеренно-континентального климата с продолжительной холодной зимой 
              и коротким прохладным летом.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  ac_unit
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                  Зима
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  -12°C до -15°C
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  wb_sunny
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                  Лето
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  +16°C до +18°C
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  water_drop
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                  Осадки
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  600-700 мм/год
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Как добраться */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title">Как добраться</h2>
          </div>
          <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary)' }}>
                  flight
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Самолётом
                </h3>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                Аэропорт Сыктывкара принимает рейсы из Москвы, Санкт-Петербурга и других крупных городов России. 
                Время полёта из Москвы — около 2 часов.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary)' }}>
                  train
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Поездом
                </h3>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                Железнодорожный вокзал Сыктывкара связан с Москвой, Санкт-Петербургом, Воркутой и другими городами. 
                Время в пути из Москвы — около 20 часов.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary)' }}>
                  directions_car
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Автомобилем
                </h3>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                До Сыктывкара можно добраться по федеральной трассе М-8 «Холмогоры». 
                Расстояние от Москвы — около 1200 км.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
