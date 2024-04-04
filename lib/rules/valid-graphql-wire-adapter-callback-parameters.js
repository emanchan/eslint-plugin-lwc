/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../util/doc-url');
module.exports = {
    meta: {
        docs: {
            description: 'validate graphql error callback parameter',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-graphql-error-callback-parameter'),
        },

        schema: [],
    },

    create(context) {
        return {
            MethodDefinition(node) {
                const { decorators } = node;

                // Check that the @wire decorator is using graphql
                const graphQlDecorator = decorators.find((decorator) => {
                    return decorator.expression.arguments.find((argument) => {
                        return argument.name === 'graphql';
                    });
                });

                // Verify that the method definition is using 'errors' not 'error
                if (graphQlDecorator !== undefined) {
                    if (node.value.type === 'FunctionExpression') {
                        const objectPatternNode = node.value.params.find(
                            (param) => param.type === 'ObjectPattern',
                        );
                        if (objectPatternNode !== undefined) {
                            const incorrectErrorParameter = objectPatternNode.properties.find(
                                (property) => {
                                    return property.value.name === 'error';
                                },
                            );
                            if (incorrectErrorParameter !== undefined) {
                                context.report({
                                    node,
                                    message:
                                        '@wire graphql callback function object must use "errors" instead of "error"',
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};
