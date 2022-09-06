import Link from 'next/link';

import logoLight from '../../assets/logo-light.png';
import Image from 'next/image';
import Container from '../Container';

import styles from './Nav.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSearch, { SEARCH_STATE_LOADED } from '../../hooks/use-search';
import { postPathBySlug } from '../../lib/posts';
import { FaSearch } from 'react-icons/fa';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav = () => {
  const navItems = [
    { id: 1, link: 'https://herstelmobiel.nl/hoe-werkt-het', title: 'Hoe werkt het?' },
    { id: 1, link: 'https://herstelmobiel.nl/algemene-vragen', title: 'Algemene vragen' },
    { id: 2, link: '/', title: 'Blog' },
    { id: 3, link: 'https://herstelmobiel.nl/voor-de-herstellers', title: 'Voor de Herstellers' },
    { id: 4, link: 'https://herstelmobiel.nl/klantenservice', title: 'Klantenservice' },
  ];

  const formRef = useRef();

  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);
  const [menuVisibility, setMenuVisibility] = useState(false);

  const { query, results, search, clearSearch, state } = useSearch({
    maxResults: 5,
  });

  const searchIsLoaded = state === SEARCH_STATE_LOADED;

  // When the search visibility changes, we want to add an event listener that allows us to
  // detect when someone clicks outside of the search box, allowing us to close the results
  // when focus is drawn away from search

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists

    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    // When the search box opens up, additionall find the search input and focus
    // on the element so someone can start typing right away

    const searchInput = Array.from(formRef.current.elements).find((input) => input.type === 'search');

    searchInput.focus();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility, menuVisibility]);

  /**
   * addDocumentOnClick
   */

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * removeDocumentOnClick
   */

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * handleOnDocumentClick
   */

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  /**
   * handleOnSearch
   */

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  /**
   * handleOnToggleSearch
   */

  function handleOnToggleSearch() {
    setSearchVisibility(SEARCH_VISIBLE);
  }

  function toggleMenu() {
    setMenuVisibility(!menuVisibility);
  }

  /**
   * addResultsRoving
   */

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  /**
   * removeResultsRoving
   */

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  /**
   * handleResultsRoving
   */

  function handleResultsRoving(e) {
    const focusElement = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement.nodeName === 'INPUT' && focusElement.nextSibling.children[0].nodeName !== 'P') {
        focusElement.nextSibling.children[0].firstChild.firstChild.focus();
      } else if (focusElement.parentElement.nextSibling) {
        focusElement.parentElement.nextSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.firstChild.firstChild.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement.nodeName === 'A' && focusElement.parentElement.previousSibling) {
        focusElement.parentElement.previousSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.lastChild.firstChild.focus();
      }
    }
  }

  /**
   * escFunction
   */

  // pressing esc while search is focused will close it

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      clearSearch();
      setSearchVisibility(SEARCH_HIDDEN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className={styles.topnav}>
      <Container>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <Image src={logoLight} width="74px" height="74px" alt="HerstelMobiel.nl" />
            </a>
          </Link>
        </div>
        <div className={styles.menu_extras}>
          <div className={styles.menu_item}>
            <a
              onClick={toggleMenu}
              className={menuVisibility ? styles.navbar_toggle + ' ' + styles.open : styles.navbar_toggle}
            >
              <div className={styles.lines}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>
          </div>
        </div>

        <div className={styles.navigation} style={{ display: menuVisibility ? 'block' : 'none' }}>
          <ul className={styles.navigation_menu}>
            {searchVisibility === SEARCH_HIDDEN &&
              navItems.map((item, key) => (
                <li key={key}>
                  <Link href={item.link} passHref>
                    <a className={item.id === 2 ? styles.active : ''} onClick={toggleMenu}>
                      {item.title}
                    </a>
                  </Link>
                </li>
              ))}
            <li>
              <div className={styles.navSearch}>
                {searchVisibility === SEARCH_HIDDEN && (
                  <button onClick={handleOnToggleSearch} disabled={!searchIsLoaded}>
                    <span className="sr-only">Toggle Search</span>
                    <FaSearch />
                  </button>
                )}
                {searchVisibility === SEARCH_VISIBLE && (
                  <form ref={formRef} action="/search" data-search-is-active={!!query}>
                    <input
                      type="search"
                      name="q"
                      value={query || ''}
                      onChange={handleOnSearch}
                      autoComplete="off"
                      placeholder="Search..."
                      required
                    />
                    <div className={styles.navSearchResults}>
                      {results.length > 0 && (
                        <ul>
                          {results.map(({ slug, title }, index) => {
                            return (
                              <li key={slug}>
                                <Link tabIndex={index} href={postPathBySlug(slug)}>
                                  <a
                                    onClick={toggleMenu}
                                    dangerouslySetInnerHTML={{
                                      __html: title,
                                    }}
                                  ></a>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {results.length === 0 && (
                        <p>
                          Sorry, not finding anything for <strong>{query}</strong>
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </li>
          </ul>
        </div>
      </Container>
    </header>
  );
};

export default Nav;
