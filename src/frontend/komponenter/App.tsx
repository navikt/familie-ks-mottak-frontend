import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hentInnloggetBruker } from '../api/saksbehandler';
import { ISaksbehandler } from '../typer/saksbehandler';
import Dekoratør from './Felleskomponenter/Dekoratør/Dekoratør';
import { TaskProvider } from './TaskProvider';

const App: React.FunctionalComponent = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = React.useState<ISaksbehandler>();

    React.useEffect(() => {
        hentInnloggetBruker().then(innhentetInnloggetSaksbehandler => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    return (
        <TaskProvider>
            <Dekoratør
                innloggetSaksbehandler={innloggetSaksbehandler}
                tittel={'Oppgavebehandling'}
                onClick={() => {
                    window.location.href = `${window.origin}/auth/logout`;
                }}
            />
            <div className={'container'}>
                <Router>
                    <Switch>
                        <Route
                            exact={true}
                            path="/"
                            render={({ match }) => {
                                return <div />;
                            }}
                        />
                    </Switch>
                </Router>
            </div>
        </TaskProvider>
    );
};

export default App;
